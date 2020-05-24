import faker from 'faker';
import _ from 'lodash';

import {
  createBaseType, createInputValue, getName, getKinds, updateType, createField, createDirective,
} from './create-types';

const createIntrospection = async ({ db, introspectionQuery, name }) => {
  const introspectionSchema = await db.createGqlIntrospectionSchema({
    name: name || faker.commerce.productName(),
  });

  const unlistedTypes = ['__Schema', '__Type', '__TypeKind', '__Field', '__InputValue', '__EnumValue', '__Directive', '__DirectiveLocation', 'CacheControlScope', 'Upload'];

  const typesToCreate = introspectionQuery.types.filter((type) => (
    !unlistedTypes.includes(type.name)));

  const createdTypes = await Promise.all(
    typesToCreate.map(
      async (type) => db.createGqlType(createBaseType({ type, schemaId: introspectionSchema.id })),
    ),
  );

  let inputValues = [];
  let fields = [];
  typesToCreate.map((type) => {
    if (type.inputFields) inputValues = inputValues.concat(type.inputFields);
    if (type.fields) {
      type.fields.map((field) => {
        if (field.args) inputValues = inputValues.concat(field.args);
        fields.push(field);
        return field;
      });
    }
    return type;
  });
  introspectionQuery.directives.map((directive) => {
    inputValues = inputValues.concat(directive.args);
    return directive;
  });

  inputValues = _.uniqBy(inputValues, (item) => getName({ type: item }) + getKinds({ type: item }));
  fields = _.uniqBy(fields, (item) => getName({ type: item }) + getKinds({ type: item }));

  const createdInputFields = await Promise.all(
    inputValues.map(
      (inputValue) => db.createGqlInputValue(createInputValue({ inputValue })),
    ),
  );

  const createdFields = await Promise.all(
    fields.map(
      (field) => db.createGqlField(createField({ field, createdInputFields })),
    ),
  );

  await db.updateGqlIntrospectionSchema({
    data: {
      types: {
        connect: createdTypes.map((type) => ({ id: type.id })),
      },
      directives: {
        create: introspectionQuery.directives.map(
          (directive) => createDirective({ directive, createdInputFields }),
        ),
      },
    },
    where: {
      id: introspectionSchema.id,
    },
  });
  const forCreateTypes = typesToCreate.map((type) => {
    const createdType = createdTypes.find((item) => item.name === type.name);
    return {
      id: createdType.id,
      type: updateType({ type, createdInputFields, createdFields }),
    };
  });
  await Promise.all(forCreateTypes.map((item) => db.updateGqlType({
    where: { id: item.id },
    data: item.type,
  })));

  return introspectionSchema.id;
};

export default createIntrospection;

export const getKinds = ({ type }) => {
  if (type.type) return getKinds({ type: type.type });
  const res = [type.kind];
  return type.ofType ? res.concat(getKinds({ type: type.ofType })) : res;
};

export const getName = ({ type }) => (type.ofType ? getName({ type: type.ofType }) : type.name);

export const createBaseType = ({ type, schemaId }) => {
  const baseType = {
    name: getName({ type }),
    description: type.description,
    schema: { connect: { id: schemaId } },
    kind: type.kind,
  };
  return baseType;
};

export const createInputValue = ({ inputValue }) => {
  const createdInputValue = {
    name: inputValue.name,
    description: inputValue.description,
    defaultValue: inputValue.defaultValue,
    kinds: { set: getKinds({ type: inputValue.type }) },
    typeName: getName({ type: inputValue.type }),
  };

  return createdInputValue;
};

export const createField = ({ field, createdInputFields }) => {
  const createdField = {
    name: field.name,
    description: field.description,
    isDeprecated: field.isDeprecated,
    deprecationReason: field.deprecationReason,
    kinds: { set: getKinds({ type: field.type }) },
    typeName: getName({ type: field.type }),
  };

  if (field.args) {
    const args = field.args.map((iField) => ({
      id: createdInputFields.find((item) => item.name === iField.name).id,
    }));
    createdField.args = { connect: args };
  }

  return createdField;
};

export const createDirective = ({ directive, createdInputFields }) => {
  const createdDirective = {
    name: directive.name,
    description: directive.description,
    locations: { set: directive.locations },
  };

  if (directive.args) {
    const args = directive.args.map((dir) => ({
      id: createdInputFields.find((item) => item.name === dir.name).id,
    }));
    createdDirective.args = { connect: args };
  }

  return createdDirective;
};

export const updateType = ({ type, createdInputFields, createdFields }) => {
  const updatedType = {
    name: getName({ type }),
    description: type.description,
  };

  if (type.possibleTypes) {
    const possibleTypes = type.possibleTypes.map((iField) => ({
      kind: iField.kind,
      name: iField.name,
    }));
    updatedType.possibleTypes = { create: possibleTypes };
  }

  if (type.interfaces && type.interfaces.length && type.interfaces.length !== 0) {
    const interfaces = type.interfaces.map((iField) => ({
      kind: iField.kind,
      name: iField.name,
    }));
    updatedType.interfaces = { create: interfaces };
  }
  if (type.fields) {
    const fields = type.fields.map((iField) => ({
      id: createdFields.find(
        (item) => item.name + item.kinds === iField.name + getKinds({ type: iField.type }),
      ).id,
    }));
    updatedType.fields = { connect: fields };
  }
  if (type.inputFields) {
    const inputFields = type.inputFields.map((iField) => ({
      id: createdInputFields.find((item) => item.name === iField.name).id,
    }));
    updatedType.inputFields = { connect: inputFields };
  }

  if (type.enumValues) {
    const enums = type.enumValues.map(({
      name, description, isDeprecated, deprecationReason,
    }) => ({
      name,
      description,
      isDeprecated,
      deprecationReason,
    }));
    updatedType.enumValues = { create: enums };
  }
  return updatedType;
};

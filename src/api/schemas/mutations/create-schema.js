import { ApolloError } from 'apollo-server-express';
import crypto from 'crypto';
import faker from 'faker';

import getIntrospectionResult from '../functions/get-introspection-result';
import createIntrospection from '../functions/create-introspection';

export default async (root, args, { prisma, user }) => {
  if (!user) throw new Error('Access denied');
  const { apiKey, endpoint } = args;

  const schemasCount = await prisma.gqlSchemasConnection({ where: { owner: { id: user.id } } })
    .aggregate()
    .count();
  if (schemasCount > 10) throw new Error('No more than 10 schemas can be created');

  let introspectionQuery;

  try {
    introspectionQuery = await getIntrospectionResult(args);
  } catch (err) {
    return new ApolloError('Enter a correct graphql endpoint url or apikey');
  }

  const introspectionSchema = await createIntrospection({
    user,
    db: prisma,
    introspectionQuery: introspectionQuery.data.data.__schema,
  });

  const schema = await prisma.createGqlSchema({
    name: faker.commerce.productName(),
    apiKey: apiKey || crypto.randomBytes(24).toString('hex'),
    owner: { connect: { id: user.id } },
    members: { connect: { id: user.id } },
    introspectionSchema: { connect: { id: introspectionSchema } },
    endpointUrl: endpoint,
  });

  return schema;
};

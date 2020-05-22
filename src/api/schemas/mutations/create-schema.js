import crypto from 'crypto';
import faker from 'faker';

import getIntrospectionResult from '../../schema-versions/functions/get-introspection-result';

export default async (root, { name, endpoint }, { prisma, user }) => {
  if (!user) throw new Error('Access denied');

  const schemasCount = await prisma.gqlSchemasConnection({ where: { owner: { id: user.id } } })
    .aggregate()
    .count();
  if (schemasCount > 10) throw new Error('No more than 10 schemas can be created');

  const introspectionQuery = await getIntrospectionResult(endpoint);

  const schema = await prisma.createGqlSchema({
    name: name || faker.commerce.productName(),
    apiKey: crypto.randomBytes(24).toString('hex'),
    owner: { connect: { id: user.id } },
    members: { connect: { id: user.id } },
    latestVersion: {
      create: {
        number: 1,
        introspectionQuery,
        endpointUrl: endpoint,
        createdBy: { connect: { id: user.id } },
      },
    },
  });

  return schema;
};

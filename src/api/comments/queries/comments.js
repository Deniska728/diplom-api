import { ApolloError, AuthenticationError } from 'apollo-server-express';

export default async (root, { schemaId, id }, { prisma, user }) => {
  if (!user) throw new AuthenticationError('Access denied');

  const schemaQuery = {
    where: {
      id: schemaId,
      members_some: { id: user.id },
    },
    first: 1,
  };

  const schemas = await prisma.gqlSchemas(schemaQuery);
  const schema = schemas[0];
  if (!schema) throw new ApolloError('Schema not found or access denied');

  const query = {
    where: {
      OR: [
        {
          gqlType: {
            id,
          },
        },
        {
          gqlField: {
            id,
          },
        },
      ],
    },
    orderBy: 'createdAt_ASC',
  };

  return prisma.comments(query);
};

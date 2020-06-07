import { AuthenticationError, ApolloError } from 'apollo-server-express';

export default {
  resolve: (payload) => ({
    mutation: payload.mutation,
    comment: payload.node,
    previousValues: payload.previousValues,
  }),
  subscribe: async (parent, { schemaId, id }, { prisma, user }) => {
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

    return prisma.$subscribe.comment({
      node: {
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
    });
  },
};

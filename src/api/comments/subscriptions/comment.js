export default {
  resolve: (payload) => ({
    mutation: payload.mutation,
    comment: payload.node,
    previousValues: payload.previousValues,
  }),
  subscribe: async (parent, { schemaId, gqlTypeId }, { prisma, user }) => {
    if (!user) throw new Error('Access denied');

    const schemaQuery = {
      where: {
        id: schemaId,
        members_some: { id: user.id },
      },
      first: 1,
    };

    const schemas = await prisma.gqlSchemas(schemaQuery);
    const schema = schemas[0];
    if (!schema) throw new Error('Schema not found or access denied');

    return prisma.$subscribe.comment({
      node: {
        gqlType: { id: gqlTypeId },
      },
    });
  },
};

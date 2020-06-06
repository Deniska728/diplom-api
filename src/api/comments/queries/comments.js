export default async (root, { schemaId, id }, { prisma, user }) => {
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

  const query = {
    where: {
      OR: [
        {
          gqlType: {
            id,
          },
          gqlField: {
            id,
          },
        },
      ],
    },
    orderBy: 'createdAt_DESC',
  };

  return prisma.comments(query);
};

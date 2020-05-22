export default async (root, { id, apiKey }, { prisma, user }) => {
  if (!user) return null;
  if (!id && !apiKey) throw new Error('Schema ID or API key is required');

  const schemas = id
    ? await prisma.gqlSchemas({
      where: {
        id,
        members_some: { id: user.id },
      },
      first: 1,
    }) : await prisma.gqlSchemas({
      where: {
        apiKey,
      },
      first: 1,
    });

  const schema = schemas[0];
  if (!schema) throw new Error('Schema not found or access denied');

  return schema;
};

export default async (root, {
  schemaId, gqlTypeId, content,
}, { prisma, user }) => {
  if (!user) throw new Error('Access denied');

  const schemas = await prisma.gqlSchemas({
    where: {
      id: schemaId,
      members_some: { id: user.id },
    },
    first: 1,
  });

  const schema = schemas[0];
  if (!schema) throw new Error('Schema not found or access denied');

  const query = {
    createdBy: { connect: { id: user.id } },
    content: { create: { message: content } },
    gqlType: { connect: { id: gqlTypeId } },
  };

  const comment = await prisma.createComment(query);

  return comment;
};

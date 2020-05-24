export default async (root, { id }, { prisma, user }) => {
  if (!user) throw new Error('Access denied');

  const doesSchemaExist = await prisma.$exists.gqlSchema({
    id,
    owner: {
      id: user.id,
    },
  });

  if (!doesSchemaExist) throw new Error('Schema not found or access denied');

  const schema = prisma.deleteGqlSchema({
    id,
  });

  return schema;
};

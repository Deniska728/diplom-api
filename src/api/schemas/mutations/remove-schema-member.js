export default async (root, { schemaId, userId }, { prisma, user }) => {
  if (!user) throw new Error('Access denied');

  const doesSchemaExist = await prisma.$exists.gqlSchema({
    id: schemaId,
    members_some: { id: user.id },
  });
  if (!doesSchemaExist) throw new Error('Schema not found or access denied');

  await prisma.updateGqlSchema({
    where: { id: schemaId },
    data: {
      members: {
        disconnect: { id: userId },
      },
    },
  });

  return userId;
};

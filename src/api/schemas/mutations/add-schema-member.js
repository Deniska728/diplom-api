export default async (root, { schemaId, email }, { prisma, user }) => {
  if (!user) throw new Error('Access denied');

  const doesSchemaExist = await prisma.$exists.gqlSchema({
    id: schemaId,
    members_some: { id: user.id },
  });
  if (!doesSchemaExist) throw new Error('Schema not found or access denied');

  const currentUser = await prisma.users({ where: { email } });

  if (!currentUser[0]) throw new Error('User is not sign up.');
  if (user.email === email) throw new Error('You can not add yourself');

  const members = await prisma.updateGqlSchema({
    where: { id: schemaId },
    data: {
      members: {
        connect: { id: currentUser[0].id },
      },
    },
  }).members();

  return members;
};

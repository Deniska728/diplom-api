export default async (root, args, { prisma, user }) => {
  if (!user) return null;

  return prisma.gqlSchemas({
    where: {
      members_some: {
        id: user.id,
      },
    },
    orderBy: 'createdAt_DESC',
  });
};

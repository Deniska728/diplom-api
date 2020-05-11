export default (_, args, { user, prisma }) => {
  if (!user) throw new Error('Access denied');

  return prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: user.id } },
  });
};

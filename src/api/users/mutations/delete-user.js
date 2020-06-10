import { AuthenticationError, UserInputError } from 'apollo-server-express';

export default async (parent, { id }, { prisma, ...ctx }) => {
  if (!ctx.user) throw new AuthenticationError('Access denied');

  const user = await prisma.user({ id });

  if (!user) throw new UserInputError('User not found');

  if (ctx.user.id !== user.id) throw new UserInputError('Access denied');

  return prisma.deleteUser({ id });
};

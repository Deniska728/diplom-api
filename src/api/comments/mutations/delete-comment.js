import { ApolloError, AuthenticationError } from 'apollo-server-express';

export default async (root, {
  commentId,
}, { prisma, user }) => {
  if (!user) throw new AuthenticationError('Access denied');

  const doesCommentExist = await prisma.$exists.comment({
    id: commentId,
    createdBy: {
      id: user.id,
    },
  });

  if (!doesCommentExist) throw new ApolloError('Comment not found or access denied');

  return prisma.deleteComment({ id: commentId });
};

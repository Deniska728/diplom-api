export default async (root, {
  commentId,
}, { prisma, user }) => {
  if (!user) throw new Error('Access denied');

  const doesCommentExist = await prisma.$exists.comment({
    id: commentId,
    createdBy: {
      id: user.id,
    },
  });

  if (!doesCommentExist) throw new Error('Comment not found or access denied');

  return prisma.deleteComment({ id: commentId });
};

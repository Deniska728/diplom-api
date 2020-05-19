export default {
  User: {
    profile: ({ id }, args, { prisma }) => prisma.user({ id }).profile(),
  },
};

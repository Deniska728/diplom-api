export default {
  User: {
    profile: ({ id }, args, { db }) => db.user({ id }).profile(),
  },
};

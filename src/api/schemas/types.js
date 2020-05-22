export default {
  Schema: {
    members: ({ id }, _, { prisma }) => prisma.gqlSchema({ id }).members(),
    latestVersion: ({ id }, _, { prisma }) => prisma.gqlSchema({ id }).latestVersion(),
    versions: ({ id }, _, { prisma }) => prisma.gqlSchema({ id }).versions(),
    owner: ({ id }, _, { prisma }) => prisma.gqlSchema({ id }).owner(),
  },
};

export default {
  Comment: {
    content: ({ id }, _, { prisma }) => prisma.comment({ id }).content(),
    createdBy: ({ id }, _, { prisma }) => prisma.comment({ id }).createdBy(),
  },
};

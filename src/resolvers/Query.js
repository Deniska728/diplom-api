function feed(parent, args, context) {
  return context.prisma.links();
}

module.exports = {
  feed,
};

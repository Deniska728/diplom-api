const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

async function signup(parent, args, context) {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  const { password, ...user } = await context.prisma.createUser({
    ...args,
    password: hashedPassword,
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context) {
  const { password, ...user } = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

function post(parent, args, { user, prisma }) {
  if (!user) throw new Error('Access denied');

  return prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: user.id } },
  });
}

module.exports = {
  signup,
  login,
  post,
};

import { ApolloError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { APP_SECRET } = process.env;

export default async (parent, args, { prisma }) => {
  const foundUser = await prisma.user({ email: args.email });
  if (!foundUser) {
    throw new ApolloError('No such user found');
  }

  const { password, ...user } = foundUser;

  const valid = await bcrypt.compare(args.password, password);
  if (!valid) {
    throw new UserInputError('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

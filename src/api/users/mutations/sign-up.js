import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { APP_SECRET } = process.env;

export default async (parent, args, { prisma }) => {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  const { password, ...user } = await prisma.createUser({
    ...args,
    password: hashedPassword,
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

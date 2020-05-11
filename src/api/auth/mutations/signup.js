import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../../utils';

export default async (parent, args, context) => {
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
};

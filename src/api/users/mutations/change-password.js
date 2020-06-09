import { UserInputError, ForbiddenError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

export default async (parent, { token, oldPassword, password }, { prisma, user }) => {
  let id = user && user.id;

  if (!id && token) {
    const users = await prisma.users({
      where: { resetPasswordToken: token },
    });
    const user = users[0];

    if (!user) throw new UserInputError('Invalid token');

    id = user.id;

    if (user.resetPasswordExpiresAt && dayjs().diff(user.resetPasswordExpiresAt, 'minutes') > 0) {
      await prisma.updateUser({
        where: { id },
        data: { resetPasswordToken: null },
      });

      throw new Error('Token is expired');
    }
  } else if (!id && !token) {
    throw new ForbiddenError('Token is required');
  } else {
    if (!oldPassword) throw new ForbiddenError('Old password is required');

    const user = await prisma.user({ id });

    if (user.password) {
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) throw new ForbiddenError('Incorrect old password');
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.updateUser({
      where: { id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });

    return user;
  } catch (err) {
    throw new Error('Password has not changed');
  }
};

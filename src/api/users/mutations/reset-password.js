import { UserInputError } from 'apollo-server-express';
import dayjs from 'dayjs';
import crypto from 'crypto';

import sendEmail from '../../../integrations/emails/sendEmail';

export default async (parent, { email }, { prisma }) => {
  const resetPasswordExpiresTime = [2, 'hours'];
  const user = await prisma.user({ email });
  if (!user) return true;

  // const tokenExpired = dayjs().diff(dayjs(user.resetPasswordExpiresAt).subtract(...resetPasswordExpiresTime), 'minutes') < 15;
  // if (user.resetPasswordExpiresAt && tokenExpired) {
  //   throw new UserInputError('Try to reset a password later');
  // }

  const firstName = user.profile && user.profile.firstName ? user.profile.firstName : user.username;
  const resetPasswordToken = crypto.randomBytes(30).toString('hex');

  await prisma.updateUser({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken,
      resetPasswordExpiresAt: dayjs().add(...resetPasswordExpiresTime).toDate(),
    },
  });

  await sendEmail({
    to: email,
    subject: 'GraphQQ Reset Your Password',
    text: `Hi ${firstName},\n
A password reset has been requested for the account related to this email address (${user.email}).\n
To reset the password, visit the following link: \n
${process.env.WEB_APP_URL}/reset-password/${resetPasswordToken}
    `,
  });

  return true;
};

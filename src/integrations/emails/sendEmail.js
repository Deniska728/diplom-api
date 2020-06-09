import nodemailer from './nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  const data = {
    to,
    subject,
    text,
    from: 'GraphQQ <denis790504790@gmail.com>',
  };

  try {
    const message = await nodemailer.sendMail(data);

    return message && !!message.messageId;
  } catch (e) {
    console.error(e);
  }

  return false;
};

export default sendEmail;

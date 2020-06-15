import nodemailer from 'nodemailer';

const { MAIL_URL, MAIL_PASS } = process.env;

export default nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  sequre: true,
  auth: {
    user: MAIL_URL,
    pass: MAIL_PASS,
  },
});

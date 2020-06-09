import nodemailer from 'nodemailer';

const { MAIL_URL, MAIL_PASS } = process.env;

export default nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_URL,
    pass: MAIL_PASS,
  },
});

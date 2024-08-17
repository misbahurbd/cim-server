import nodemailer from 'nodemailer';
import config from '../config';

import httpStatus from 'http-status';
import { AppError } from '../errors/appError';

const transporter = nodemailer.createTransport({
  service: 'email',
  host: 'smtp.gmail.com',
  port: config.NODE_ENV === 'production' ? 465 : 587,
  secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.mailer_email,
    pass: config.mailer_pass,
  },
});

const sendMail = async (
  email: string,
  subject: string,
  emailTemplate: string,
) => {
  try {
    const mail = await transporter.sendMail({
      from: {
        name: 'CIM - Store Management',
        address: config.mailer_email!,
      },
      to: email,
      subject: subject,
      html: emailTemplate,
    });
    return mail;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to send mail',
      null,
    );
  }
};

export default sendMail;

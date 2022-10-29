import * as nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

export const sendMail = async (
  to: string,
  subject: string,
  htmlContent: string,
) => {
  if (
    !process.env.GOOGLE_MAILER_CLIENT_ID ||
    !process.env.GOOGLE_MAILER_CLIENT_SECRET ||
    !process.env.GOOGLE_MAILER_REFRESH_TOKEN ||
    !process.env.ADMIN_EMAIL_ADDRESS
  ) {
    throw Error('Env for send mail not found.');
  }

  const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET,
  );

  myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
  });

  const myAccessTokenObject = await myOAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.ADMIN_EMAIL_ADDRESS,
      clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: myAccessTokenObject?.token,
    },
  });

  const options = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  return await transporter.sendMail(options);
};

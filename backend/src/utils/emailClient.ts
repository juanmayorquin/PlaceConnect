import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // o host + port si usaste Mailtrap o personalizado
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"PlaceConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
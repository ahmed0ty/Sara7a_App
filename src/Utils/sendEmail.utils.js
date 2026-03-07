import nodemailer from "nodemailer";

export async function sendEmail({
  to = "",
  subject = "Sa7aha Application",
  text = "",
  html = "",
  cc = "",
  bcc = "",
  attachments = [],
}) {

  console.log("EMAIL:", process.env.EMAIL);
  console.log("PASS:", process.env.APP_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

try {
  const info = await transporter.sendMail({
    from: `Sara7a 👻 <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    attachments,
  });

  console.log("message sent:", info.messageId);

} catch (error) {
  console.log("EMAIL ERROR:", error);
}e.log("message sent:", info.messageId);
}

export const emailSubject = {
  confirmEmail: "confirm your email",
  resetPassword: "reset your password",
  welcome: "welcome to route academy",
};
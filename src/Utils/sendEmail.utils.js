import nodemailer from "nodemailer";

export async function sendEmail({
  to = "",
  subject = "",
  text = "",
  html = "",
}) {

  console.log("STEP 1: sendEmail called");
  console.log("EMAIL:", process.env.EMAIL);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  console.log("STEP 2: transporter created");

  try {

    console.log("STEP 3: before sendMail");

    const info = await transporter.sendMail({
      from: `Sara7a 👻 <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("STEP 4: message sent", info.messageId);

  } catch (error) {

    console.log("STEP ERROR:", error);

  }
}

export const emailSubject = {
  confirmEmail: "confirm your email",
  resetPassword: "reset your password",
  welcome: "welcome to route academy",
};
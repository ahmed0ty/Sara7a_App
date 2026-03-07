import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to = "",
  subject = "Sa7aha Application",
  text = "",
  html = "",
  cc = "",
  bcc = "",
  attachments = [],
}) {

  const { data, error } = await resend.emails.send({
    from: "Sara7a 👻 <onboarding@resend.dev>",
    to: to,
    subject: subject,
    html: html,
  });

  if (error) {
    console.log("Email Error:", error);
    return;
  }

  console.log("message sent:", data);
}

export const emailSubject = {
  confirmEmail: "confirm your email",
  resetPassword: "reset your password",
  welcome: "welcome to route academy",
};
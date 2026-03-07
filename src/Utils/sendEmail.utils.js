import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test");
export async function sendEmail({
  to = "",
  subject = "Sara7a Application",
  html = "",
}) {

  try {

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

    console.log("Email sent successfully:", data);

  } catch (err) {
    console.log("Resend Error:", err);
  }

}

export const emailSubject = {
  confirmEmail: "Confirm your email",
  resetPassword: "Reset your password",
  welcome: "Welcome to Sara7a",
};
import { EventEmitter } from "node:events";
import { emailSubject, sendEmail } from "../Utils/sendEmail.utils.js";
import { template } from "./email/generateHTML.js";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
  try {
    await sendEmail({
      to: data.to,
      html: template(data.otp, data.firstName),
      subject: emailSubject.confirmEmail,
    });
  } catch (error) {
    console.log("Email Error:", error);
  }
});

emailEvent.on("forgetpassword", async (data) => {
  try {
    await sendEmail({
      to: data.to,
      html: template(data.otp, data.firstName, emailSubject.resetPassword),
      subject: emailSubject.resetPassword,
    });
  } catch (error) {
    console.log("Email Error:", error);
  }
});
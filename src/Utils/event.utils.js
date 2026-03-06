
import { EventEmitter } from "node:events";
import { emailSubject, sendEmail } from "../Utils/sendEmail.utils.js";
import { template } from "./email/generateHTML.js";



export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    html: template(data.otp,data.firstName),
    subject: emailSubject.confirmEmail,
  });
});


emailEvent.on("forgetpassword", async (data) => {
  await sendEmail({
    to: data.to,
    html: template(data.otp,data.firstName,emailSubject.resetPassword),
    subject: emailSubject.resetPassword,
  });
});

















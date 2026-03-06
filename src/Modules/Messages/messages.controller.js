
import { Router } from "express";
import * as messageService from "../Messages/messages.service.js";
import { cloudFileUpload } from "../../Utils/cloud.multer.js";
import { fileValidation } from "../../Utils/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { getMessageValidation, sendMessageValidation } from "./message.validation.js";
import { authentication, tokenTypesEnum } from "../../Middlewares/authentication.middleware.js";

const router = Router();

router.post(
  "/:receiverId/send-message",
  cloudFileUpload({ validation: [...fileValidation.images] }).array(
    "attachments",
    3,
  ),
  validation(sendMessageValidation),
  messageService.sendMessages,
);



router.post(
  "/:receiverId/sender",
  authentication({tokenType:tokenTypesEnum.access}),
  cloudFileUpload({ validation: [...fileValidation.images] }).array(
    "attachments",
    3,
  ),
  validation(sendMessageValidation),
  messageService.sendMessages,
);




router.get(
  "/:userId/get-messages",
  validation(getMessageValidation),
  messageService.getMessages,
);





export default router;

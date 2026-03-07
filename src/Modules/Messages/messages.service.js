
import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { MessageModel } from "../../DB/Models/messages.model.js";
import { cloudinaryConfig } from "../../Utils/cloudinary.js";
import { successResponse } from "../../Utils/successResponse.utils.js";

export const sendMessages = async (req, res, next) => {
  const { receiverId } = req.params;
  const { content } = req.body;

  if (
    !(await dbService.findOne({
      model: UserModel,
      filter: {
        _id: receiverId,
        deletedAt: { $exists: false },
        confirmEmail: { $exists: true },
      },
    }))
  ) {
    return next(new Error("Invalid Recipient Account", { cause: 404 }));
  }

  const attachments = [];
  if (req.files) {
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
        file.path , {folder:`Sara7aAPP/Messages/${receiverId}`},
      );

      attachments.push({ secure_url, public_id });
    }
  }

  const message = await dbService.create({
  model: MessageModel,
  data: [
    {
      content,
      attachments,
      receiverId,

      senderId:req.user?._id

    },
  ],
});

return successResponse({
  res,
  statusCode: 201,
  message: "Message Sent Successfully!",
  data: { message },
});
};


export const getMessages = async (req, res, next) => {
  const { userId } = req.params;

const messages = await dbService.find({
    model:MessageModel,
    filter:{
        receiverId:userId
    },
    populate:[{
        path:"receiverId" , 
        select:"email gender firstName lastName -_id"
    }]
})
 

return successResponse({
  res,
  statusCode: 200,
  message: "Message Fetched Successfully!",
  data: { messages },
});
};







export const deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;

  const message = await dbService.findById({
    model: MessageModel,
    id: messageId,
  });

  if (!message) {
    return next(new Error("Message Not Found", { cause: 404 }));
  }


  if (
    message.receiverId.toString() !== req.user._id.toString() &&
    message.senderId?.toString() !== req.user._id.toString()
  ) {
    return next(new Error("Unauthorized", { cause: 403 }));
  }

  await dbService.deleteOne({
    model: MessageModel,
    filter: { _id: messageId },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Message Deleted Successfully",
  });
};
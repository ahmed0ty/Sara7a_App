

import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {


content: {
  type: String,
  minLength: 2,
  maxLength: 20000,
  required: function(){
    return this.attachments?.length ? false : true
  },
},


attachments: [
  {
    secure_url: String,
    public_id: String,
  },
],


receiverId: {
  type: Schema.Types.ObjectId,
  ref: "user",
  required: true,
},


senderId: {
  type: Schema.Types.ObjectId,
  ref: "user",
},

   
  },
  { timestamps: true }
);

export const MessageModel = mongoose.models.message || mongoose.model("Message",messageSchema)
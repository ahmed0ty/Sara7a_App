

import { create, findOne , updateOne } from "../../DB/dbService.js";
import { providers, roles, UserModel } from "../../DB/Models/user.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.utils.js";
import { encrypt } from "../../Utils/encryption.utils.js";
import { compare, hash } from "../../Utils/hash.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import jwt from "jsonwebtoken";
import { getNewLoginCerdintials, getSignature, logoutEnums, signatureEnum, signToken } from "../../Utils/token.utils.js";
import { OAuth2Client } from "google-auth-library";
import { emailSubject, sendEmail } from "../../Utils/sendEmail.utils.js";
import { emailEvent } from "../../Utils/event.utils.js";
import { customAlphabet, nanoid } from "nanoid";
import * as dbService from "../../DB/dbService.js";
import joi from "joi";
import { TokenModel } from "../../DB/Models/token.model.js";




export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password,confirmPassword, gender, phone, role } = req.body;






  if (await findOne({ model: UserModel, filter: { email } }))
    return next(new Error("user already exist", { cause: 409 }));

  const hashPassword = await hash({ plainText: password });

  const encryptedPhone = encrypt(phone);


const code = customAlphabet("0123456789",6)() ;
const hashOTP = await hash({plainText:code})

  emailEvent.emit("confirmEmail",{to:email,otp:code,firstName})


  const user = await create({
    model: UserModel,
    data: [
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        gender,
        phone: encryptedPhone,
        role,
        confirmEmailOTP:hashOTP,

      },
    ],
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "user created successfully",
    data: user,
  });
});














async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return payload;
}


export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const { email, email_verified, picture, given_name, family_name } =
    await verifyGoogleAccount({ idToken });

  if (!email_verified)
    return next(new Error("Email not verified", { cause: 401 }));

  const user = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (user) {
    if (user.provider === providers.google) {

          const newCredentials = await getNewLoginCerdintials(user)

      return successResponse({
        res,
        statusCode: 201,
        message: "user logged in successfully",
        data: { newCredentials },
      });
    }
  }

  const newUser = await create({
    model: UserModel,
    data: [
      {
        email,
        firstName: given_name,
        lastName: family_name,
        photo: picture,
        confirmEmail: Date.now(),
        provider: providers.google,
      },
    ],
  });

      const newCredentials = await getNewLoginCerdintials(user)

  return successResponse({
    res,
    statusCode: 201,
    message: "user created in successfully",
    data: { newCredentials },
  });
};








export const login = asyncHandler(async (req, res, next) => {
  
    const { email, password } = req.body;

    const user = await findOne({model:UserModel , filter:{email}}) // عملنا بالايميل بس
    if (!user)
      return next(new Error("user not found",{cause:404}))

    const isMatch = await compare({plainText:password , hash:user.password})
    if(!isMatch)
    {
        return next(new Error("invalid credentails",{cause:401}))
    }

    const newCredentials = await getNewLoginCerdintials(user)



     return successResponse({
    res,
    statusCode:201,
    message:"user logged in successfully",
    data:{newCredentials}
  })
   
})






export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;


  const user = await dbService.findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmail: { $exists: false },
      confirmEmailOTP: { $exists: true},
    },
  });

  if (!user)
    return next(new Error("User Not Fount Or Email Already Confirmed"));

  console.log("Entered OTP:", otp);
console.log("Stored OTP:", user.confirmEmailOTP);
  if (!(await compare({ plainText: otp, hash: user.confirmEmailOTP })))
    return next(new Error("Invalid OTP", { cause: 401 }));


await UserModel.updateOne(
  { email },               
  {
    confirmEmail: Date.now(),  
    $unset: { confirmEmailOTP: "" },
    $inc: { __v: 1 },      
  }
);

  return successResponse({
    res,
    statusCode: 200,
    message: "Email Confirmed Successfully",
    
  });
};




export const refreshToken = async (req, res, next) => {
  const user = req.user;


    const newCredentials = await getNewLoginCerdintials(user)

  return successResponse({
    res,
    statusCode: 201,
    message: "New credintials generated successfully",
    data: { newCredentials },
  });
};



export const forgetPassword = async (req, res, next) => {

  const {email}  = req.body


const otp = await customAlphabet("0123456789", 6)();
const hashOTP = await hash({ plainText: otp });

const user = await dbService.findOneAndUpdate({
  model: UserModel,
  filters: {
    email,
    provider: providers.system,
    confirmEmail: { $exists: true },
    deletedAt: { $exists: false },
  },
  data: {
    forgetPasswordOTP: hashOTP,
  },
});

if (!user)
  return next(
    new Error("User Not Found Or Email Not Confirmed", { cause: 404 })
  );


emailEvent.emit("forgetpassword", {
  to: email,
  firstName: user.firstName,
  otp,
});

return successResponse({
  res,
  statusCode: 200,
  message: "Check Your Inbox",
});
  
};


export const resetPassword = async (req, res, next) => {

  const {email , otp ,password}  = req.body


const user = await dbService.findOne({
  model: UserModel,
  filters: {
    email,
    provider: providers.system,
    confirmEmail: { $exists: true },
    deletedAt: { $exists: false },
    forgetPasswordOTP:{$exists: true}
  },

});

if (!user)
  return next(
    new Error("Invalid Account", { cause: 404 })
  );

  if (!(await compare({ plainText: otp, hash: user.forgetPasswordOTP }))) {
  return next(new Error("Invalid OTP", { cause: 400 }));
}


const hashedPassword = await hash({ plainText: password });


await dbService.updateOne({
  model: UserModel,
  filters: { email },
  data: {
    password: hashedPassword,
    $unset: { forgetPasswordOTP: true },
  },
  $inc: { __v: 1 },
});

return successResponse({
  res,
  statusCode: 200,
  message: "Passowrd Reset Successfully",
});
  
};






export const logout = async (req, res, next) => {

  const {flag} = req.body

  let status = 200 ;

  switch (flag) {
  case logoutEnums.logoutFromAllDevices:
   
    await dbService.updateOne({
      model: UserModel,
      filters: { _id: req.user._id },
      data: {
        changeCredentialsTime: Date.now(),
      },
    });
    break;

  default:
    await dbService.create({
      model: TokenModel,
      data: [
        {
          jti: req.decoded.jti,
          userId: req.user._id,
          expiresIn: Date.now() - req.decoded.exp,
        },
      ],
    });
    status = 201;
    break;
}


  await dbService.create({
    model: TokenModel,
    data: [
      {
        jti: req.decoded.jti,
        userId: req.user._id,
        expiresIn: Date.now() - req.decoded.exp,
      },
    ],
  });

  return successResponse({
    res,
    statusCode: status,
    message: "User logged out successfully",
  });
};

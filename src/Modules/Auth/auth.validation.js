

import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { logoutEnums } from "../../Utils/token.utils.js";
 export const signupValidation = {
    body:joi
  .object({

firstName: generalFields.firstName.required(),
lastName: generalFields.lastName.required(),
email: generalFields.email.required(),
password: generalFields.password.required(),
confirmPassword: generalFields.confirmPassword,
gender: generalFields.gender,
phone: generalFields.phone,
role: generalFields.role,


  })
  .required(),
 }


  export const loginValidation = {
    body:joi
    .object({

    email: generalFields.email.required() ,
    password: generalFields.password.required(),
   
  })
  .required(),
  }


    export const SocialLoginValidation = {
    body:joi
    .object({

    idToken:joi.string().required()
   
  })
  .required(),
  }
  
export const confirmEmailValidation = {
  body: joi
    .object({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
    })
    .required(),
};




export const forgetPasswordValidation = {
  body: joi
    .object({
      email: generalFields.email.required(),
    })
    .required(),
};



export const resetPasswordValidation = {
  body: joi
    .object({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.confirmPassword,
    })
    .required(),
};


export const logoutValidation = {
  body: joi
    .object({
      flag:joi.string().valid(...Object.values(logoutEnums)).default(logoutEnums.stayLoggedIn)
    })
    .required(),
};

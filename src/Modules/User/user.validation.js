
import joi from "joi"
import { generalFields } from "../../Middlewares/validation.middleware.js"
import { logoutEnums } from "../../Utils/token.utils.js"
import { fileValidation } from "../../Utils/local.multer.js"

export const shareProfileValidation = {
    params:joi.object({
        userId:generalFields.id.required()
    })
}


export const UpdateProfileValidation = {
    body:joi.object({
        firstName:generalFields.firstName,
        lastName:generalFields.lastName,
        phone:generalFields.phone,
        gender:generalFields.gender
    })
}

export const freezeAccountValidation = {
    params:joi.object({

        userId:generalFields.id
    })
}


export const restoreAccountValidation = {
    params:joi.object({

        userId:generalFields.id.required()
    })
}

export const hardDeleteAccountValidation = {
    params:joi.object({

        userId:generalFields.id.required()
    })
}


export const updatePasswordValidation = {
    body:joi.object({

        flag:joi.string().valid(...Object.values(logoutEnums)).default(logoutEnums.stayLoggedIn),
        oldPassword:generalFields.password.required(),
        password:generalFields.password.not(joi.ref("oldPassword")).required(),
        confirmPassword:generalFields.confirmPassword
    })
}


export const profileImageValidation = {
  file: joi
    .object({
      fieldname: generalFields.file.fieldname.valid("profileImage").required(),
      originalname: generalFields.file.originalname.required(),
      encoding: generalFields.file.encoding.required(),
      mimetype: generalFields.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      size: generalFields.file.size.max(5 * 1024 * 1024).required(), // 5MB
      path: generalFields.file.path.required(),
      filename: generalFields.file.filename.required(),
      finalPath: generalFields.file.finalPath.required(),
      destination: generalFields.file.destination.required(),
    })
    .required(),
};



export const coverImageValidation = {
  files: joi.array().items(
    joi.object({
      fieldname: generalFields.file.fieldname.valid("profileImage").required(),
      originalname: generalFields.file.originalname.required(),
      encoding: generalFields.file.encoding.required(),
      mimetype: generalFields.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      size: generalFields.file.size.max(5 * 1024 * 1024).required(), // 5MB
      path: generalFields.file.path.required(),
      filename: generalFields.file.filename.required(),
      finalPath: generalFields.file.finalPath.required(),
      destination: generalFields.file.destination.required(),
    })
  )
    
    .required(),
};
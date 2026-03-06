

import { Router } from "express";

import * as userService from "../User/user.service.js"
import { authentication, authorization, tokenTypesEnum } from "../../Middlewares/authentication.middleware.js";
import { endPoints } from "../User/user.authorization.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { coverImageValidation, freezeAccountValidation, hardDeleteAccountValidation, profileImageValidation, restoreAccountValidation, shareProfileValidation, updatePasswordValidation, UpdateProfileValidation } from "../User/user.validation.js";
import { shareProfile } from "../User/user.service.js";
import { fileValidation, localFileUpload } from "../../Utils/local.multer.js";
import { cloudFileUpload } from "../../Utils/cloud.multer.js";

const router = Router()

router.get('/getprofile',authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.getProfile}),userService.getSingleUser)


router.get('/share-profile/:userId',validation(shareProfileValidation),userService.shareProfile)

router.patch('/update-profile',validation(UpdateProfileValidation),authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.updateProfile}),userService.updateProfile)

router.delete('/:userId?/freeze-account',
  validation(freezeAccountValidation),
  authentication({ tokenType: tokenTypesEnum.access }),
  authorization({ accessRoles: endPoints.freezeAccount }),
  userService.freezeAccount
);





router.patch('/:userId/restore-account',
  validation(restoreAccountValidation),
  authentication({ tokenType: tokenTypesEnum.access }),
  authorization({ accessRoles: endPoints.restoreAccount }),
  userService.restoreAccount
);





router.delete('/:userId/hard-delete',
  validation(hardDeleteAccountValidation),
  authentication({ tokenType: tokenTypesEnum.access }),
  authorization({ accessRoles: endPoints.hardDeletedAccount }),
  userService.hardDeletedAccount
);



router.patch('/update-password',
  validation(updatePasswordValidation),
  authentication({ tokenType: tokenTypesEnum.access }),
  authorization({ accessRoles: endPoints.updatePassword}),
  userService.updatePassword
);




router.patch('/update-profile-image',
  
  authentication({ tokenType: tokenTypesEnum.access }),

  cloudFileUpload({validation:[...fileValidation.images]}).single("profileImage"),
  userService.updateProfileImage
);




router.patch('/cover-image',
  
  authentication({ tokenType: tokenTypesEnum.access }),
  cloudFileUpload({validation:[...fileValidation.images]}).array("profileImage"),
  userService.coverImages
);





export default router

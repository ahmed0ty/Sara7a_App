
import { Router } from "express";
import * as authService from "../Auth/auth.service.js"
import { authentication, tokenTypesEnum } from "../../Middlewares/authentication.middleware.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { confirmEmailValidation, forgetPasswordValidation, loginValidation, logoutValidation, resetPasswordValidation, signupValidation, SocialLoginValidation } from "../Auth/auth.validation.js";

const router = Router()

router.post('/signup',validation(signupValidation),authService.signUp)
router.post('/login',validation(loginValidation),authService.login)

router.post('/social-login',validation(SocialLoginValidation),authService.loginWithGmail)



router.get('/refresh-token',authentication({tokenType:tokenTypesEnum.refresh}),authService.refreshToken)



router.patch('/confirm-email',validation(confirmEmailValidation),authService.confirmEmail)


router.patch('/forget-password',validation(forgetPasswordValidation),authService.forgetPassword)


router.patch('/reset-password',validation(resetPasswordValidation),authService.resetPassword)




router.post(
  "/logout",validation(logoutValidation),
  authentication({ tokenType: tokenTypesEnum.access }),
  authService.logout
);





export default router

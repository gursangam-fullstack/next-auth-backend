const express = require('express');
const { userRegistration, verifyTempUser, userLogin, userProfile, userLogout, userChangePassword, userForgotPasswordOtpSender, userVerifyForgotPasswordOtp } = require('../controllers/userController');
const {userRegistrationSchema,LoginFormSchema, changePasswordSchema ,forgotPasswordOtpSchema,verifyForgotPasswordOtpSchema} = require('../validations/authValidation')
const { accessTokenAutoRefresh } = require('../middlewares/accessTokenAutoRefresh');
const passport = require('passport');
const userRouter = express.Router();
const otpLimiter =  require('../utils/otpLimiter');
const validate = require ('../middlewares/validate');

// Public Routes
userRouter.post('/signup',validate(userRegistrationSchema),otpLimiter,userRegistration)
userRouter.post('/verify-otp',otpLimiter, verifyTempUser)
userRouter.post('/login',validate(LoginFormSchema) ,otpLimiter,userLogin)
userRouter.post('/forgot-password-send-otp', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }),validate(forgotPasswordOtpSchema), userForgotPasswordOtpSender)
userRouter.post('/verify-forgot-password-otp', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), validate(verifyForgotPasswordOtpSchema),userVerifyForgotPasswordOtp)

//protected routes
userRouter.get('/me', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), userProfile)
userRouter.post('/logout', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), userLogout)
userRouter.put('/change-password', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }),validate(changePasswordSchema),  userChangePassword)


module.exports = userRouter;
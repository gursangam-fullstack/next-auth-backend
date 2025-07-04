const express = require('express');
const { userRegistration, verifyTempUser, userLogin, userProfile, userLogout, userChangePassword, userForgotPasswordOtpSender, userVerifyForgotPasswordOtp } = require('../controllers/userController');
const { accessTokenAutoRefresh } = require('../middlewares/accessTokenAutoRefresh');
const passport = require('passport');
const userRouter = express.Router();
const otpLimiter =  require('../utils/otpLimiter');

// Public Routes
userRouter.post('/signup', otpLimiter,userRegistration)
userRouter.post('/verify-otp',otpLimiter, verifyTempUser)
userRouter.post('/login', otpLimiter,userLogin)
userRouter.post('/forgot-password-send-otp', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), userForgotPasswordOtpSender)
userRouter.post('/verify-forgot-password-otp', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), userVerifyForgotPasswordOtp)

//protected routes
userRouter.get('/me', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), userProfile)
userRouter.post('/logout', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), userLogout)
userRouter.put('/change-password', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), userChangePassword)


module.exports = userRouter;
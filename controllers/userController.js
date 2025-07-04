const sendResponse = require("../utils/sendResponse");
const UserModel = require('../model/User')
const bcrypt = require('bcrypt')
const generateOtp = require('../utils/generateOtp')
const sendEmailFun = require('../config/sendEmail')
const VerificationEmail = require('../utils/verifyEmailTemplate')
const tempUser = require('../model/tempUser');
const { generateTokens } = require("../utils/generateTokens");
const { setTokensCookies } = require("../utils/setTokensCookies");
const userRefreshTokenModel = require('../model/userRefreshToken');
const { userRegistrationSchema } = require("../validations/authValidation");
const formatZodError = require("../utils/formatZodError");

// user registration
exports.userRegistration = async (req, res) => {
const validationResult = userRegistrationSchema.safeParse(req.body);
    if (!validationResult.success) {
        const messages = formatZodError(validationResult.error);
const combinedMessage = messages.join(', ');
return sendResponse(res, combinedMessage, 400, false);
    }
    
    //const { name, email, mobile, password } = userRegistrationSchema.parse(req.body);
const { name, email, mobile, password } = validationResult.data;

    try {

        if (!name || !email || !password) {
            return sendResponse(res, "all fields are required", 400, false)
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return sendResponse(res, "User already exists", 400, false);
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const { otp, otpExpiresAt } = generateOtp(10);

        await tempUser.findOneAndUpdate(
            { email },
            { name, email, mobile, passwordHash: hashedPassword, otp, otpExpiresAt },
            { upsert: true, new: true }
        );

        console.log(`OTP for ${email}: ${otp} ${name}`);

        sendEmailFun({
            to: email,
            subject: "Verify Your Email - Ecommerce",
            text: "test",
            html: VerificationEmail(name, otp),
        }).catch(err => {
            // console.error("Failed to send email:", err);
        });

        return sendResponse(res, "OTP sent successfully", 200, true);
    } catch (err) {
       
        // console.error("Error in user registration:", err);
        return sendResponse(res, "Unable to register please try again later", 500, false);
    }
};

// user Email Verification
exports.verifyTempUser = async (req, res) => {
    // console.log("verifyTempUser", req.body);
    const { email, otp } = req.body;

    try {
        const tempUserData = await tempUser.findOne({ email });

        if (
            !tempUserData ||
            tempUserData.otp !== otp ||
            tempUserData.otpExpiresAt < new Date()
        ) {
            return sendResponse(res, "Invalid or expired OTP", 400, false);
        }

        const newUser = await new UserModel({
            name: tempUserData.name,
            email: tempUserData.email,
            mobile: tempUserData.mobile,
            password: tempUserData.passwordHash,
        }).save();

        await tempUser.deleteOne({ email });

        return sendResponse(res, "Eamil verified", 200, true);

    } catch (err) {
        // console.error("Error in verifyTempUser:", err);
        return sendResponse(res, "Unable to verify otp please try again later", 500, false);
    }
};

// user login
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendResponse(res, "Invalid email or password", 404, false)
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return sendResponse(res, "Invalid email or password", 401, false)
        }

        //generate token
        let tokens;
        try {
            tokens = await generateTokens(user);
        } catch (err) {
            // console.log(err);
            return sendResponse(res, "Unable to create access or refresh token", 500, false);
        }
        const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = tokens;

        // set cookies
        setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

        //send success response with tokens
        return sendResponse(res, "Login Successfully", 200, true, {
            user: { id: user._id, email: user.email, name: user.name, roles: user.role[0] },
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_exp: accessTokenExp,
            is_auth: true
        })

    } catch (error) {
        // console.log(error);
        sendResponse(res, "Unable to Login please try again later", 500, false)
    }
}

// user logout
exports.userLogout = async (req, res) => {
    try {
        // Remove refresh token from DB if user is authenticated
        if (req.user && req.user.id) {
            await userRefreshTokenModel.deleteMany({ userId: req.user.id });
        } else if (req.body && req.body.userId) {
            await userRefreshTokenModel.deleteMany({ userId: req.body.userId });
        }
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
        res.clearCookie('is_auth', { sameSite: 'strict' });
        return sendResponse(res, "Logout successful", 200, true);
    } catch (error) {
        console.log(error);
        return sendResponse(res, "Unable to Logout please try again later", 500, false);
    }
}

// change password
exports.userChangePassword = async (req, res) => {
    try {
        const { password, password_confirmation } = req.body;

        if (password !== password_confirmation) {
            return sendResponse(res, "New Password and Confirm New Password don't match")
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const newHashedPassword = await bcrypt.hash(password, salt);

        await UserModel.findByIdAndUpdate(req.user._id, {
            $set: {
                password: newHashedPassword
            }
        })

        return sendResponse(res, "Password changed successfully", 200, true)

    } catch (error) {
        console.log(error);
        return sendResponse(res, "Unable to Change Password please try again later", 500, false)
    }
}

//userprofile
exports.userProfile = async (req, res) => {
    res.send({ "user": req.user })
}

exports.userForgotPasswordOtpSender = async (req, res) => {
    // console.log("forgotPasswordOtpSender",req.body)
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendResponse(res, "User not found", 404, false);
        }

        const { otp, otpExpiresAt } = generateOtp(10);

        await tempUser.findOneAndUpdate(
            { email },
            { otp, otpExpiresAt },
            { upsert: true, new: true }
        );

        console.log(`OTP for ${email}: ${otp} ${user.name}`);

        sendEmailFun({
            to: email,
            subject: "Forgot Password OTP",
            text: "test",
            html: VerificationEmail(user.name, otp),
        });

        return sendResponse(res, "OTP sent successfully", 200, true);
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return sendResponse(res, "Internal server error", 500, false);
    }
};

exports.userVerifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        const checkTempUser = await tempUser.findOne({ email });
        if (!checkTempUser || checkTempUser.otp !== otp || checkTempUser.otpExpiresAt < new Date()) {
            return sendResponse(res, "Invalid or expired OTP", 400, false);
        }

        if (newPassword !== confirmPassword) {
            return sendResponse(res, "New password and confirm password do not match", 400, false);
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendResponse(res, "User not found", 404, false);
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        await tempUser.deleteOne({ email });

        return sendResponse(res, "Password updated successfully", 200, true);
    } catch (error) {
        console.error("Verify Forgot Password OTP Error:", error);
        return sendResponse(res, "Internal server error", 500, false);
    }
};

// user registration
// user Email Verification
// user login
// get new access token or refresh token
// change password
// profile of logged in user
// send password reset email
// user logout
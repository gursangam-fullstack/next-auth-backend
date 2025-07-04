const generateOtp = (expiryMinutes = 10) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    return { otp, otpExpiresAt };
};

module.exports = generateOtp;

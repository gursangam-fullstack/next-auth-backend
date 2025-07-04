exports.setTokensCookies = (res, accessToken, refreshToken, accessTokenExp, refreshTokenExp) => {
    try {
        // Calculate expiration dates
        const accessTokenExpDate = new Date(accessTokenExp * 1000);
        const refreshTokenExpDate = new Date(refreshTokenExp * 1000);
        
        console.log('setTokensCookies: Setting cookies');
        console.log('accessToken:', accessToken);
        console.log('refreshToken:', refreshToken);
        console.log('accessTokenExp:', accessTokenExpDate);
        console.log('refreshTokenExp:', refreshTokenExpDate);

        // Set access token cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'strict',
            expires: accessTokenExpDate,
            path: '/' // Make sure path is set correctly
        });

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'strict',
            expires: refreshTokenExpDate,
            path: '/' // Make sure path is set correctly
        });

        console.log('setTokensCookies: Cookies set successfully');
    } catch (error) {
        console.error('Error setting cookies:', error);
    }
};

const { set } = require("mongoose");
const { isTokenExpire } = require("../utils/isTokenExpired");
const { refreshAccessToken } = require("../utils/refreshAccessToken");
const sendResponse = require("../utils/sendResponse");
const { setTokensCookies } = require("../utils/setTokensCookies");

exports.accessTokenAutoRefresh = async (req, res, next) => {
    try {
        let accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        
        console.log('accessTokenAutoRefresh: received accessToken from cookie:', accessToken);
        console.log('accessTokenAutoRefresh: received refreshToken from cookie:', refreshToken);

        // Check if access token exists and is valid
        if (accessToken && !isTokenExpire(accessToken)) {
            req.headers['authorization'] = `Bearer ${accessToken}`;
            console.log('accessTokenAutoRefresh: using existing valid accessToken');
            return next();
        }

        // Access token is missing or expired, try to refresh
        console.log('accessTokenAutoRefresh: accessToken expired or missing, trying to refresh');
        
        if (!refreshToken) {
            throw new Error("Both access token and refresh token are missing");
        }

        // Refresh the access token
        const result = await refreshAccessToken(req);
        
        if (result.error) {
            throw new Error(result.message || "Failed to refresh token");
        }

        const { newAccessToken, newAccessTokenExp, newRefreshToken, newRefreshTokenExp } = result;

        console.log('accessTokenAutoRefresh: refresh successful, setting new cookies');
        console.log('newAccessToken:', newAccessToken);
        console.log('newRefreshToken:', newRefreshToken);

        // Set the new tokens in cookies
        setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);

        // Set authorization header for current request
        req.headers['authorization'] = `Bearer ${newAccessToken}`;
        console.log('accessTokenAutoRefresh: set new accessToken in header');

        // IMPORTANT: Update the request cookies for immediate use
        req.cookies.accessToken = newAccessToken;
        req.cookies.refreshToken = newRefreshToken;

        next();
    } catch (error) {
        console.log("error in accessTokenAutoRefresh", error);
        sendResponse(res, "Unauthorized, Access token is missing or invalid", 401, false);
    }
};
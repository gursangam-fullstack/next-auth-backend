const sendResponse = (res, message, statusCode, success, data = null) => {
    return res.status(statusCode).json({
        success,
        error: !success,
        message,
        data,
    });
};

module.exports = sendResponse;
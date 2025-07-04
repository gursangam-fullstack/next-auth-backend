const formatZodError = (zodError) => {
    return zodError.errors.map(err => err.message);
};

module.exports = formatZodError;
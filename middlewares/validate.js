// middlewares/validate.js
const formatZodError = require('../utils/formatZodError'); // adjust path as needed

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = formatZodError(result.error);
    const combinedMessage = messages.join(', ');
    return res.status(400).json({
      success: false,
      message: combinedMessage,
    });
  }

  req.validatedData = result.data; // attach parsed & validated data to request
  next();
};

module.exports = validate;

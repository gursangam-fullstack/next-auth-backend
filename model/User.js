const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: [String],
    enum: ["user", "admin"],
    default: ["user"],
  },
},);

// Export the model
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

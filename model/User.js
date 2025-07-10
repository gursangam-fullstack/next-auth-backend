const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        trim: true,
        // new code added
        default :null
    },
    googleId: {
    type: String,
    default: null,
  },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: [String],
        enum: ["user", "admin"],
        default: ["user"]
    }
})



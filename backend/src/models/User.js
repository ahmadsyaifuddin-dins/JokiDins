const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  avatar: {
    type: String
  },
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    // Kalau user Google-only, kamu bisa hilangkan 'required: true'
    // atau generate password random
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phones: { 
    type: [String], 
    default: [] },  // Daftar nomor HP yang tersimpan

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  verificationCode: { 
    type: String, 
    default: null 
  },

  verificationCodeExpires: {
    type: Date,
    default: null
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  telegramChatId: { 
    type: String 
  },
  telegramToken: { 
    type: String 
  },

  loginMethod: { type: String, enum: ["google", "manual"], default: "manual" },

  googleId: { type: String, default: null },

  birthday: { type: Date },
  
  gender: { type: String },
}, 
{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);

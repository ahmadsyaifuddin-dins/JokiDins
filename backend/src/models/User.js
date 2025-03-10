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

  // Field tambahan (untuk masa depan)
  // birthday: { type: Date },
  // gender: { type: String },
  // Bisa tambahin googleId buat menandakan user dari Google
  googleId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

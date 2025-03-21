// models/Activity.js
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Activity", ActivitySchema);

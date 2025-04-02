// models/Activity.js
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Activity", ActivitySchema);

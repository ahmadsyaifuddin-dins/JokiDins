const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  service: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'cancelled']
  },
  file: {
    filename: String,
    originalName: String,
    path: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
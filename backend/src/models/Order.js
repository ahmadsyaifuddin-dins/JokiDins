const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    service: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    phone: { 
      type: [String], 
      default: [],
      required: true,
    },
    provider: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'processing', 'completed', 'cancelled'],
    },
    file: {
      type: String, // Simpan URL dari Vercel Blob
      required: false,
    },
    
    completedAt: {
      type: Date,
      default: null,
    },
    // Field baru:
    paymentAmount: {
      type: Number,
      default: 0,
    },

    fixedAmount: {
      type: Number,
      default: 0,
    },

    packageName: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['belum dibayar', 'dicicil', 'lunas'],
      default: 'belum dibayar',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const pendapatanSchema = mongoose.Schema({
  nominal: {
    type: Number,
    required: [true, 'Nominal wajib diisi'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pendapatan', pendapatanSchema);

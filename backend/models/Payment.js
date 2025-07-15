const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdata', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['membership', 'session', 'supplement', 'other'], required: true },
  method: { type: String, enum: ['cash', 'card', 'online', 'other'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

module.exports = mongoose.model('Payment', PaymentSchema); 
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userdata' }
});

module.exports = mongoose.model('Expense', ExpenseSchema); 
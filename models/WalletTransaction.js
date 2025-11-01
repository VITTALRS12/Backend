// models/WalletTransaction.js
const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  source: { type: String, enum: ['referral', 'manual', 'contest', 'purchase'], required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);

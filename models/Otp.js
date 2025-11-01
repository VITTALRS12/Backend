const mongoose = require('mongoose');

// File: models/Otp.js
const otpSchema = new mongoose.Schema({
  target: String,
  otpCode: String,
  expiresAt: Date,
  used: { type: Boolean, default: false },
  userData: Object
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
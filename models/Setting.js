const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed, // can be string, number, array, etc.
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);

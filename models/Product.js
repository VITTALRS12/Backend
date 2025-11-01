const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  category: String,
  brand: String,
  sizes: [String],
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

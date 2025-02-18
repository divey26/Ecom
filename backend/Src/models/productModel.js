const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  offerName: { type: String, required: true },
  discount: { type: Number, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

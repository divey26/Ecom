// cart.model.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  itemName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageURL: { type: String },
  quantity: { type: Number, required: true },
  discount: { type: Number, default: 0 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

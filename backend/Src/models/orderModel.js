const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'FormData', required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  paymentIntentId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;

const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  sellerId: { type: String, required: true, unique: true }, // Unique identifier for each seller
  name: { type: String, required: true }, // Seller's name
  email: { type: String, required: true, unique: true }, // Seller's email
  phone: { type: String, required: true }, // Seller's phone number
  address: { type: String, required: true }, // Seller's address
  shopName: { type: String, required: true }, // The name of the seller's shop/store
  password: { type: String, required: true }, // Seller's password
  registrationDate: { type: Date, default: Date.now }, // The date when the seller registered
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;

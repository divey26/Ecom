const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  layout: { type: String, required: true }, // New layout field
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;

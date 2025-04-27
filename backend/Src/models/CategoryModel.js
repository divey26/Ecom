const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategories: [subcategorySchema],
  categoryId: {
    type: String, // Use a specific type based on your requirements
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

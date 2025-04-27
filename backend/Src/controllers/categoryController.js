const Category = require('../models/CategoryModel');

const createCategory = async (req, res) => {
    try {
      const { categoryName, subcategories, categoryId, imageURL } = req.body;
  
      // Validate required fields
      if (!categoryName || !subcategories || !categoryId || !imageURL) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Fix: Ensure subcategories are formatted correctly
      const subcategoryObjects = subcategories.map(sub => ({
        name: typeof sub === 'string' ? sub : sub.name,
      }));
  
      // Create a new category
      const newCategory = new Category({
        name: categoryName,
        subcategories: subcategoryObjects,
        categoryId,
        imageURL,
      });
  
      // Save to database
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  };
  
  
// Add getCategories to the exports
const getCategories = async (req, res) => {
    try {
      const categories = await Category.find().lean(); // Fetch as plain objects for manipulation
      const formattedCategories = categories.map(cat => ({
        categoryName: cat.name,
        subcategories: cat.subcategories.map(sub => sub.name).join(', '), // Join subcategory names
        categoryId: cat.categoryId,
        imageURL: cat.imageURL,
      }));
      res.status(200).json(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  };
  
module.exports = { createCategory, getCategories };

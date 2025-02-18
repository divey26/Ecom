const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, editProduct, deleteProduct, getprocate } = require('../controllers/productController');

// Define the routes
router.post('/', createProduct);
router.get('/', getProducts);  // Fetch all products
router.get('/:productId', getProductById); // Fetch product details by productId
router.put('/:productId', editProduct);  // Edit product
router.delete('/:productId', deleteProduct);  // Delete product

// Add the new route for fetching products by categoryId
router.get('/category', getprocate);  // Fetch products by categoryId

module.exports = router;

const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, editProduct, deleteProduct, getprocate,updateStock,getProductByObjectId } = require('../controllers/productController');


// Define the routes
router.post('/', createProduct);
router.get('/', getProducts);  // Fetch all products
router.get('/:productId', getProductById); // Fetch product details by productId
router.put('/:productId', editProduct);  // Edit product
router.delete('/:productId', deleteProduct);  // Delete product

router.put('/updateStock/:productId', updateStock); // Update stock
router.get('/category', getprocate);  // Fetch products by categoryId
router.get('/objectId/:objectId', getProductByObjectId);  // Fetch product by ObjectId

module.exports = router;

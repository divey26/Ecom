const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/orderController');

// Create a new order
router.post('/create', createOrder);

// Get all orders
router.get('/view', getAllOrders);  // This will handle fetching all orders.

module.exports = router;



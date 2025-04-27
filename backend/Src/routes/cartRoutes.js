const express = require('express');
const router = express.Router();
const {
  addItemToCart,
  getCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require('../controllers/cartController');

// Route to add an item to the cart
router.post('/add', addItemToCart);

// Route to get the cart for a specific user
router.get('/:userId', getCart);

// Route to update the quantity of an item in the cart
router.put('/update', updateItemQuantity);

// Route to remove an item from the cart
router.delete('/remove', removeItemFromCart);

router.post('/clear', clearCart);

module.exports = router;

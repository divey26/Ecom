const Cart = require('../models/Cart');
const Product = require('../models/productModel');

// Add item to cart
// Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log("cart body", req.body);

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            itemName: product.itemName, // Corrected field
            description: product.description,
            price: product.price,
            imageURL: product.imageURL,
            discount:product.discount,
            quantity,
          },
        ],
      });
    } else {
      // Check if the product is already in the cart
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (itemIndex > -1) {
        // Update quantity if item exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist in the cart
        cart.items.push({
          productId,
          itemName: product.itemName, // Corrected field
          description: product.description,
          price: product.price,
          imageURL: product.imageURL,
          discount:product.discount,
          quantity,
        });
      }
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};


// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price imageURL');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};




// Update item quantity in cart
exports.updateItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity > 0) {
      // Update the quantity if greater than zero
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Remove item from the cart if quantity is zero
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};


// Clear user's cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = []; // Clear all items
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};

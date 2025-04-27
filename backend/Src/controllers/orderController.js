const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  try {
    const { userId, cartItems, paymentIntentId, paymentStatus, totalAmount, shippingAddress } = req.body;

    // Validate required fields
    if (!userId || !cartItems || cartItems.length === 0 || !paymentIntentId || !totalAmount || isNaN(totalAmount) || !paymentStatus) {
      return res.status(400).json({ message: 'Invalid or missing order details' });
    }

    const newOrder = new Order({
      userId,
      cartItems,
      totalAmount,
      paymentIntentId,
      paymentStatus,
      orderDate: new Date(),
      shippingAddress,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error placing order. Please try again.' });
  }
};

// Fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'firstname lastname email phone')  // Populate userId with firstname, lastname, email, and phone
      .populate('cartItems.productId', 'name price');  // Populate product data for each item in the cart

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders. Please try again.' });
  }
};


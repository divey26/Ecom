const bcrypt = require('bcryptjs');
const Seller = require('../models/sellerModel'); // Assuming the Seller model is in the 'models' folder
const jwt = require('jsonwebtoken'); // Assuming JWT is being used for authentication


// Get the next seller ID
const getSellerId = async (req, res) => {
  try {
    const lastSeller = await Seller.findOne().sort({ sellerId: -1 }).limit(1); // Get the most recent seller
    const lastSellerId = lastSeller ? lastSeller.sellerId : 'SE0000'; // Default to 'SE0000' if no sellers exist

    const numberPart = parseInt(lastSellerId.substring(2)) + 1; // Increment the numeric part
    const newSellerId = `SE${numberPart.toString().padStart(4, '0')}`; // Generate a new seller ID

    res.status(200).json({ sellerId: newSellerId }); // Return the new seller ID
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching seller ID' });
  }
};

// Create a new seller
const createSeller = async (req, res) => {
  const { name, email, phone, address, shopName, password } = req.body;

  try {
    // Fetch the new seller ID
    const lastSeller = await Seller.findOne().sort({ sellerId: -1 }).limit(1); // Get the most recent seller
    const lastSellerId = lastSeller ? lastSeller.sellerId : 'SE0000'; // Default to 'SE0000' if no sellers exist

    const numberPart = parseInt(lastSellerId.substring(2)) + 1; // Increment the numeric part
    const newSellerId = `SE${numberPart.toString().padStart(4, '0')}`; // Generate a new seller ID

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the seller
    const newSeller = new Seller({
      sellerId: newSellerId,
      name,
      email,
      phone,
      address,
      shopName,
      password: hashedPassword, // Store the hashed password
    });

    // Save the seller to the database
    await newSeller.save();

    // Send the sellerId as part of the response
    res.status(201).json({ message: 'Seller created successfully!', seller: newSeller, sellerId: newSellerId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating seller' });
  }
};

// Login a seller
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the seller exists
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found. Please check your email or register' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please try again' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { sellerId: seller.sellerId, sellerObjectId: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // If login is successful, return seller details (excluding password)
    res.status(200).json({ 
      message: 'Login successful', 
      sellerId: seller.sellerId, 
      shopName: seller.shopName,
      sellerObjectId: seller._id, // Include ObjectId
      token // Send the token to the frontend
    });

  } catch (error) {
    console.error('Error logging in seller:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later' });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret
    const sellerId = decoded.sellerId; // Assuming 'sellerId' is stored in token payload

    // Find seller by ID
    const seller = await Seller.findOne({ sellerId });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json({ seller });
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getSellerId, createSeller, loginSeller, getSellerProfile };

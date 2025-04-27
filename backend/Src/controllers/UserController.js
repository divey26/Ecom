const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');

// Validation schema
const formValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  address: Joi.string().optional(),
  phone: Joi.string().optional(),
  prefix: Joi.string().required(),
  captcha: Joi.string().required(),
  agreement: Joi.boolean().valid(true).required(),
  residence: Joi.array().items(Joi.string()), // Allow residence as an array of strings

});

// User Registration
exports.registerUser = async (req, res) => {
  const { email, password, firstname, lastname, address, phone, prefix, captcha, agreement } = req.body;

  const { error } = formValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      address,
      phone,
      prefix,
      captcha,
      agreement,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving user data' });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      token,
      userId: user._id,
      email: user.email,
      address: user.address,
      phone: user.phone,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstname, lastname, address, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstname, lastname, address, phone },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};


// Remove User
exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User removed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error removing user' });
  }
};

// View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(users); // Return all users
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

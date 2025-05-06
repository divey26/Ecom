const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, removeUser, getAllUsers } = require('../controllers/UserController');
const { forgotPassword, resetPassword } = require('../controllers/PasswordResetController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);  // Fetch profile
router.put('/profile', authMiddleware, updateUserProfile);  // Update profile
router.delete('/remove/:userId', removeUser);  // Remove user by ID
// Add this route to fetch all users
router.get('/users', getAllUsers);  // Get all users (Protected route, only for authenticated users)

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;

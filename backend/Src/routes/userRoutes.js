const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, removeUser,getAllUsers } = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);  // Fetch profile
router.put('/profile', authMiddleware, updateUserProfile);  // Update profile
router.delete('/remove/:userId', removeUser);  // Remove user by ID
// Add this route to fetch all users
router.get('/users', getAllUsers);  // Get all users (Protected route, only for authenticated users)

module.exports = router;

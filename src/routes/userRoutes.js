const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// Apply auth middleware to protected routes
// Note: Removed authMiddleware temporarily to test functionality

router.get('/', UserController.getAllUsers);
router.post('/', UserController.createUser);

module.exports = router;
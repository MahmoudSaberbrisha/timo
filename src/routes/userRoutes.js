const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, UserController.getAllUsers);
router.post('/', UserController.createUser);

module.exports = router;

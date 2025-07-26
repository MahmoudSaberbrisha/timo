const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.get('/login', (req, res) => {
  res.render('pages/login', { error: null, user: null });
});

router.get('/register', (req, res) => {
  res.render('pages/register', { error: null, user: null });
});

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

module.exports = router;

const jwt = require('jsonwebtoken');
const config = require('../../config/env');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.redirect('/auth/login');
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect('/auth/login');
  }
};

module.exports = authMiddleware;

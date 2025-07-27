const authMiddleware = (req, res, next) => {
  // Check if user is logged in via session
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  
  // If it's an AJAX request, send JSON response
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  // Otherwise redirect to login
  return res.redirect('/auth/login');
};

// Optional middleware - doesn't redirect if not authenticated
const optionalAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
};

module.exports = { authMiddleware, optionalAuth };
const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.login(email, password);
      req.session.user = user; // Store user in session
      return res.redirect('/');
    } catch (error) {
      return res.render('pages/login', { error: error.message, user: null });
    }
  }

  static async register(req, res) {
    try {
      const user = await AuthService.register(req.body);
      req.session.user = user; // Store user in session
      return res.redirect('/');
    } catch (error) {
      return res.render('pages/register', { error: error.message, user: null });
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    return res.redirect('/auth/login');
  }
}

module.exports = AuthController;

const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/env');

class AuthService {
  static async login(email, password) {
    const user = await models.User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid email or password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');
    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1h' });
    return { ...user.dataValues, token };
  }

  static async register(data) {
    return await require('./userService').createUser(data);
  }
}

module.exports = AuthService;

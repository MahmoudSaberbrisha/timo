const { models } = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
  static async getAllUsers() {
    const users = await models.User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: models.Role,
          as: 'role',
          attributes: ['name']
        }
      ]
    });
    return { success: true, data: users };
  }

  static async getUserCounts() {
    const totalUsers = await models.User.count();
    const activeUsers = await models.User.count({ where: { status: 'active' } });
    const inactiveUsers = await models.User.count({ where: { status: 'inactive' } });
    return { totalUsers, activeUsers, inactiveUsers };
  }

  static async getRolesCount() {
    const rolesCount = await models.Role.count();
    return rolesCount;
  }

  static async createUser(data) {
    const { username, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await models.User.create({
      username,
      email,
      password: hashedPassword
    });
  }
}

module.exports = UserService;

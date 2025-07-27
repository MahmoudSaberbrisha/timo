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
          attributes: ['id', 'name', 'status']
        }
      ]
    });
    
    // Add mock data if no users exist yet
    const usersWithDefaults = users.map(user => ({
      ...user.dataValues,
      status: user.status || 'active',
      lastLogin: user.lastLogin || new Date().toISOString(),
      role: user.role || { name: 'مستخدم' }
    }));
    
    return { success: true, data: usersWithDefaults };
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
    const { username, email, password, role: roleName, status = 'active', name } = data;
    
    // Find role by name if provided
    let roleId = null;
    if (roleName) {
      const role = await models.Role.findOne({ where: { name: roleName } });
      if (role) {
        roleId = role.id;
      }
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username,
      email,
      password: hashedPassword,
      name: name || username,
      status,
      roleId,
      lastLogin: new Date()
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.dataValues;
    return userWithoutPassword;
  }

  static async updateUser(id, data) {
    const user = await models.User.findByPk(id);
    if (!user) throw new Error('User not found');
    
    // Handle role update
    if (data.role) {
      const role = await models.Role.findOne({ where: { name: data.role } });
      if (role) {
        data.roleId = role.id;
      }
      delete data.role;
    }
    
    // Handle password update
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    await user.update(data);
    const { password: _, ...userWithoutPassword } = user.dataValues;
    return userWithoutPassword;
  }

  static async deleteUser(id) {
    const user = await models.User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
  }
}

module.exports = UserService;
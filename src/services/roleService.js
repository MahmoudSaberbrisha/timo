const { models } = require('../models');

class RoleService {
  static async getAllRoles() {
    return await models.Role.findAll();
  }

  static async createRole(data) {
    return await models.Role.create(data);
  }

  static async updateRole(id, data) {
    const role = await models.Role.findByPk(id);
    if (!role) throw new Error('Role not found');
    return await role.update(data);
  }

  static async deleteRole(id) {
    const role = await models.Role.findByPk(id);
    if (!role) throw new Error('Role not found');
    await role.destroy();
  }
}

module.exports = RoleService;

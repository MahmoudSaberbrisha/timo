const RoleService = require('../services/roleService');
const { successResponse, errorResponse } = require('../utils/response');

class RoleController {
  static async getAllRoles(req, res) {
    try {
      const roles = await RoleService.getAllRoles();
      return res.json({ success: true, data: roles });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async createRole(req, res) {
    try {
      const role = await RoleService.createRole(req.body);
      return res.status(201).json({ success: true, data: role });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async updateRole(req, res) {
    try {
      const role = await RoleService.updateRole(req.params.id, req.body);
      return res.json({ success: true, data: role });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async deleteRole(req, res) {
    try {
      await RoleService.deleteRole(req.params.id);
      return res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}

module.exports = RoleController;

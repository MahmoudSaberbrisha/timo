const UserService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/response');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.render('pages/users', { users: users.data, user: req.session.user });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      return res.redirect('/users');
    } catch (error) {
      return res.render('pages/register', { error: error.message, user: null });
    }
  }

  static async getUserManagementData(req, res) {
    try {
      const [userCounts, rolesCount, usersResult] = await Promise.all([
        UserService.getUserCounts(),
        UserService.getRolesCount(),
        UserService.getAllUsers()
      ]);
      return res.json({
        success: true,
        data: {
          totalUsers: userCounts.totalUsers,
          activeUsers: userCounts.activeUsers,
          inactiveUsers: userCounts.inactiveUsers,
          rolesCount: rolesCount,
          users: usersResult.data
        }
      });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}

module.exports = UserController;

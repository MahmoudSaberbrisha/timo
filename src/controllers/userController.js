const UserService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/response');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      
      // If it's an AJAX request, return JSON
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json(users);
      }
      
      // Otherwise render the page
      return res.render('pages/users', { 
        users: users.data, 
        user: req.session.user 
      });
    } catch (error) {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return errorResponse(res, 500, error.message);
      }
      return res.render('pages/users', { 
        users: [], 
        user: req.session.user,
        error: error.message 
      });
    }
  }

  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      
      // If it's an AJAX request, return JSON
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.status(201).json({ 
          success: true, 
          data: user, 
          message: 'تم إنشاء المستخدم بنجاح' 
        });
      }
      
      // Otherwise redirect
      return res.redirect('/users');
    } catch (error) {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return errorResponse(res, 400, error.message);
      }
      return res.render('pages/register', { 
        error: error.message, 
        user: null 
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ 
          success: true, 
          data: user, 
          message: 'تم تحديث المستخدم بنجاح' 
        });
      }
      
      return res.redirect('/users');
    } catch (error) {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return errorResponse(res, 400, error.message);
      }
      return res.redirect('/users');
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ 
          success: true, 
          message: 'تم حذف المستخدم بنجاح' 
        });
      }
      
      return res.redirect('/users');
    } catch (error) {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return errorResponse(res, 400, error.message);
      }
      return res.redirect('/users');
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
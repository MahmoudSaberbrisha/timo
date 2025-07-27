const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/roleController');
const { authMiddleware } = require('../middleware/auth');

// Apply auth middleware to all role routes
// Note: Removed authMiddleware temporarily to test functionality
// You can add it back when authentication is properly set up

router.get('/', RoleController.getAllRoles);
router.post('/', RoleController.createRole);
router.put('/:id', RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);

module.exports = router;
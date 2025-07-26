const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, RoleController.getAllRoles);
router.post('/', authMiddleware, RoleController.createRole);
router.put('/:id', authMiddleware, RoleController.updateRole);
router.delete('/:id', authMiddleware, RoleController.deleteRole);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuth } = require('../middleware/auth');

function renderPartial(res, view, options = {}) {
  res.render(view, { ...options, layout: false });
}

const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');

// Home route with optional authentication
router.get('/', optionalAuth, (req, res) => {
  res.render('layouts/main', { 
    title: 'الصفحة الرئيسية', 
    body: 'pages/home', 
    user: req.session.user || null 
  });
});

// Use sub-routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);

// Controllers
const UserController = require('../controllers/userController');

// ==================== GENERAL SETTINGS ====================

// System General Settings - Tools
router.get('/system/general-settings/tools', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/tools', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الإعدادات العامة للنظام', 
    body: 'pages/tools', 
    user: req.session.user || null,
    extraCSS: '/css/tabs.css',
    extraJS: '/js/tabs.js'
  });
});

// Users Management
router.get('/system/general-settings/users', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/usersManagement', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'إدارة المستخدمين', 
    body: 'pages/usersManagement', 
    user: req.session.user || null,
    extraJS: '/js/usersManagement.js'
  });
});

// Roles Management
router.get('/system/general-settings/roles', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/rolesManagement', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'إدارة الأدوار والصلاحيات', 
    body: 'pages/rolesManagement', 
    user: req.session.user || null,
    extraJS: '/js/rolesManagement.js'
  });
});

// ==================== ADVANCED SETTINGS ====================

// Profile
router.get('/system/advanced-settings/profile', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/profile', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الحساب الشخصي', 
    body: 'pages/profile', 
    user: req.session.user || null 
  });
});

// Association Data
router.get('/system/advanced-settings/association-data', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/associationData', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'بيانات الجمعية', 
    body: 'pages/associationData', 
    user: req.session.user || null 
  });
});

// Notifications
router.get('/system/advanced-settings/notifications', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/notifications', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الإشعارات', 
    body: 'pages/notifications', 
    user: req.session.user || null 
  });
});

// Branding
router.get('/system/advanced-settings/branding', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/branding', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الهوية البصرية', 
    body: 'pages/branding', 
    user: req.session.user || null 
  });
});

// Security
router.get('/system/advanced-settings/security', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/security', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الأمان', 
    body: 'pages/security', 
    user: req.session.user || null 
  });
});

// Scheduling
router.get('/system/advanced-settings/scheduling', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/scheduling', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الجدولة', 
    body: 'pages/scheduling', 
    user: req.session.user || null 
  });
});

// Backup
router.get('/system/advanced-settings/backup', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/backup', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'النسخ الاحتياطي', 
    body: 'pages/backup', 
    user: req.session.user || null 
  });
});

// Communication
router.get('/system/advanced-settings/communication', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/communication', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'التواصل', 
    body: 'pages/communication', 
    user: req.session.user || null 
  });
});

// Units
router.get('/system/advanced-settings/units', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/units', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الوحدات', 
    body: 'pages/units', 
    user: req.session.user || null 
  });
});

// Messages
router.get('/system/advanced-settings/messages', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/messages', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'الرسائل', 
    body: 'pages/messages', 
    user: req.session.user || null 
  });
});

// Monitoring
router.get('/system/advanced-settings/monitoring', optionalAuth, (req, res) => {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    return renderPartial(res, 'pages/monitoring', { user: req.session.user || null });
  }
  res.render('layouts/main', { 
    title: 'المراقبة', 
    body: 'pages/monitoring', 
    user: req.session.user || null 
  });
});

// ==================== API ENDPOINTS ====================

// API endpoint to get user management data
router.get('/api/user-management/data', UserController.getUserManagementData);

// API endpoint to create user
router.post('/api/users', UserController.createUser);

// 404 Handler
router.use((req, res) => {
  res.status(404).render('layouts/main', { 
    title: 'الصفحة غير موجودة', 
    body: 'errors/404', 
    user: req.session.user || null 
  });
});

module.exports = router;
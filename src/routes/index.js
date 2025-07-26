const express = require('express');
const router = express.Router();

function renderPartial(res, view, options = {}) {
  res.render(view, { ...options, layout: false });
}

const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');

router.get('/', (req, res) => {
  res.render('layouts/main', { title: 'الصفحة الرئيسية', body: 'pages/home', user: req.session.user || null });
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);

router.get('/system/general-settings/tools', (req, res) => {
  res.render('layouts/main', { 
    title: 'الإعدادات العامة للنظام', 
    body: 'pages/tools', 
    user: req.session.user || null,
    extraCSS: '/css/tabs.css',
    extraJS: '/js/tabs.js'
  });
});

router.get('/partial/system/general-settings/tools', (req, res) => {
  renderPartial(res, 'pages/tools', { user: req.session.user || null });
});

const UserController = require('../controllers/userController');

router.get('/system/general-settings/users', (req, res) => {
  res.render('layouts/main', { 
    title: 'إدارة المستخدمين', 
    body: 'pages/usersManagement', 
    user: req.session.user || null,
    extraJS: '/js/usersManagement.js'
  });
});

// API endpoint to get user management data
router.get('/api/user-management/data', UserController.getUserManagementData);


router.get('/partial/system/general-settings/users', (req, res) => {
  renderPartial(res, 'pages/usersManagement', { user: req.session.user || null });
});

router.get('/system/general-settings/roles', (req, res) => {
  res.render('pages/rolesManagement', { user: req.session.user || null });
});

router.get('/partial/system/general-settings/roles', (req, res) => {
  renderPartial(res, 'pages/rolesManagement', { user: req.session.user || null });
});

router.get('/system/advanced-settings/profile', (req, res) => {
  res.render('pages/profile', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/profile', (req, res) => {
  renderPartial(res, 'pages/profile', { user: req.session.user || null });
});

router.get('/system/advanced-settings/association-data', (req, res) => {
  res.render('pages/associationData', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/association-data', (req, res) => {
  renderPartial(res, 'pages/associationData', { user: req.session.user || null });
});

router.get('/system/advanced-settings/notifications', (req, res) => {
  res.render('pages/notifications', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/notifications', (req, res) => {
  renderPartial(res, 'pages/notifications', { user: req.session.user || null });
});

router.get('/system/advanced-settings/branding', (req, res) => {
  res.render('pages/branding', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/branding', (req, res) => {
  renderPartial(res, 'pages/branding', { user: req.session.user || null });
});

router.get('/system/advanced-settings/security', (req, res) => {
  res.render('pages/security', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/security', (req, res) => {
  renderPartial(res, 'pages/security', { user: req.session.user || null });
});

router.get('/system/advanced-settings/scheduling', (req, res) => {
  res.render('pages/scheduling', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/scheduling', (req, res) => {
  renderPartial(res, 'pages/scheduling', { user: req.session.user || null });
});

router.get('/system/advanced-settings/backup', (req, res) => {
  res.render('pages/backup', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/backup', (req, res) => {
  renderPartial(res, 'pages/backup', { user: req.session.user || null });
});

router.get('/system/advanced-settings/communication', (req, res) => {
  res.render('pages/communication', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/communication', (req, res) => {
  renderPartial(res, 'pages/communication', { user: req.session.user || null });
});

router.get('/system/advanced-settings/units', (req, res) => {
  res.render('pages/units', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/units', (req, res) => {
  renderPartial(res, 'pages/units', { user: req.session.user || null });
});

router.get('/system/advanced-settings/messages', (req, res) => {
  res.render('pages/messages', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/messages', (req, res) => {
  renderPartial(res, 'pages/messages', { user: req.session.user || null });
});

router.get('/system/advanced-settings/monitoring', (req, res) => {
  res.render('pages/monitoring', { user: req.session.user || null });
});

router.get('/partial/system/advanced-settings/monitoring', (req, res) => {
  renderPartial(res, 'pages/monitoring', { user: req.session.user || null });
});

// 404 Handler
router.use((req, res) => {
  res.status(404).render('errors/404', { user: req.session.user || null });
});

module.exports = router;


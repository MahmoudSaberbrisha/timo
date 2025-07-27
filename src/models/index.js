const sequelize = require('../../config/database');
const User = require('./user');
const Role = require('./role');

const models = {
  User,
  Role
};

// Define relationships
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    // Create default roles if they don't exist
    return Promise.all([
      models.Role.findOrCreate({
        where: { name: 'مدير النظام' },
        defaults: {
          name: 'مدير النظام',
          description: 'مدير النظام الرئيسي',
          status: 'active'
        }
      }),
      models.Role.findOrCreate({
        where: { name: 'مستخدم' },
        defaults: {
          name: 'مستخدم',
          description: 'مستخدم عادي',
          status: 'active'
        }
      }),
      models.Role.findOrCreate({
        where: { name: 'محرر' },
        defaults: {
          name: 'محرر',
          description: 'محرر المحتوى',
          status: 'active'
        }
      })
    ]);
  })
  .then(() => console.log('Default roles created'))
  .catch(err => console.error('Database sync error:', err));

module.exports = { sequelize, models };
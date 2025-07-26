const sequelize = require('../../config/database');
const User = require('./user');
const Role = require('./role');

const models = {
  User,
  Role
};

// Define relationships here (if any)
User.associate = (models) => {
  // Add relationships if needed
};

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

module.exports = { sequelize, models };

const express = require('express');
const path = require('path');
const session = require('express-session'); // Add this
const { sequelize } = require('./src/models');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const config = require('./config/env');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve CSS and JS for tabs
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Session Middleware
app.use(session({
  secret: config.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: config.NODE_ENV === 'production' } // Set to true in production with HTTPS
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error Handling
app.use(errorHandler);

// Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Start Server
const PORT = config.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
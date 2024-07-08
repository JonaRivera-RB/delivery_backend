// Import the 'express' module to create an Express application
const express = require('express');

// Import the 'morgan' module for logging HTTP requests to the console
const logger = require('morgan');

// Import the 'cors' module to enable Cross-Origin Resource Sharing (CORS)
const cors = require('cors');

// Import the 'crypto' module to generate cryptographic keys
const crypto = require('crypto');

// Generate a random secret key for session management using crypto module
const secretKey = crypto.randomBytes(32).toString('hex');

// Import the 'passport' module for authentication
const passport = require('passport');

// Import the 'express-session' module for session management
const session = require('express-session');

// Import the users router from the './routes/users' file to handle user-related routes
const usersRouter = require('./routes/usersRoutes');
const categoriesRouter = require('./routes/categoriesRoutes');
const productsRouter = require('./routes/productsRoutes');
const addressRouter = require('./routes/addressRoutes');
const ordersRouter = require('./routes/orderRoutes');

const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json')
const admin = require('firebase-admin');
const categoriesController = require('./controllers/categoriesController');

admin.initializeApp( {
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

// Create an instance of the Express application
const app = express();

// Use the 'morgan' middleware to log requests in development format
app.use(logger('dev'));

// Use the 'express.json()' middleware to parse JSON requests
app.use(express.json());

// Use the 'express.urlencoded()' middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Use the 'cors' middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Set up session middleware for managing user sessions
app.use(session({
    secret: secretKey, // Use the randomly generated secret key for session management
    resave: false,
    saveUninitialized: false
}));

// Initialize passport middleware for authentication
app.use(passport.initialize());

// Use passport session middleware for managing user sessions
app.use(passport.session());

// Configure passport authentication using the strategy defined in './config/passport'
require('./config/passport')(passport);

// Disable the 'x-powered-by' header for security reasons
app.disable('x-powered-by');

usersRouter(app, upload);
categoriesRouter(app, upload);
productsRouter(app, upload);
addressRouter(app);
ordersRouter(app);

// Export the Express application for use in other files
module.exports = app;

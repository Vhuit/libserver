/**
 * This file is used to set up the routes for the application. 
 * It imports all the routes and sets them up on the Express app.
 */

const bookRoutes = require('../routes/bookRoutes');
const authorRoutes = require('../routes/authorRoutes');
const subjectRoutes = require('../routes/subjectRoutes');
const languageRoutes = require('../routes/languageRoutes')
const { errorHandler } = require('../middleware/errorHandler');

const express = require('express');
// Create an Express app
const app = express();
app.use(express.json()); // Parse JSON bodies of requests and responses

// Set up routes
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/subjects', subjectRoutes);
app.use('/languages', languageRoutes)

// Error handler
app.use(errorHandler);
// Export the app
module.exports = app;
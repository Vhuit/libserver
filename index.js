/**
 * Description: 
 * Main entry point for the application. 
 * This file is responsible for starting the server, 
 * connecting to the database, and setting up middleware.
 */


// Import dependencies
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Create an Express app
const app = require('./indexing/routeIndex');
// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure Express app by setting various HTTP headers
app.use(morgan('dev')); // print HTTP requests in the terminal

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is available at http://127.0.0.1:${PORT}`);
});
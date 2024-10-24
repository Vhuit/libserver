// Description: This file contains the code to connect to the MongoDB database.

// Import the mongoose module - module to handle MongoDB interactions
const mongoose = require('mongoose');

// to load environment variables from a .env file into process.env
const dotenv = require('dotenv');
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;
const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }

        const options = {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
            socketTimeoutMS: 45000, // 45 seconds socket timeout
            connectTimeoutMS: 10000, // 10 seconds connection timeout
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        
        // Connection events
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        return mongoose.connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // Rethrow the error to be caught by the application
        throw error;
    }
};

module.exports = connectToDB;

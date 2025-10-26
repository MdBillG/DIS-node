const express = require("express");
require("dotenv").config();
const connectToDB = require("./src/config/database");
const { errorHandler, notFoundHandler } = require('./src/utils/errorHandler');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    }[mongoose.connection.readyState] || 'unknown';

    const response = {
        status: dbStatus === 'connected' ? 'ok' : 'error',
        database: {
            status: dbStatus,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host || 'not connected',
            name: mongoose.connection.name || 'not connected',
            models: mongoose.modelNames()
        },
        timestamp: new Date().toISOString()
    };

    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(response);
});

// Routes
const roleRoutes = require("./src/routes/role.routes");
const userRoutes = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");
const batchRoutes = require("./src/routes/batch.routes");

app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/batches", batchRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Connect to DB and start server
connectToDB()
    .then(() => {
        console.log("Connected to MongoDB");
        const PORT = process.env.PORT || 3003;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
            process.exit(1);
        });

module.exports = app;

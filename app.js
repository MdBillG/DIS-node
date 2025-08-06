const express = require("express");
require("dotenv").config();
const connectToDB = require("./src/config/database");
const { errorHandler, notFoundHandler } = require('./src/utils/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Routes
const roleRoutes = require("./src/routes/role.routes");
const userRoutes = require("./src/routes/user.routes");

app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);

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

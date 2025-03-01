/**
 * @file server.js
 * @description Entry point for the Express server. Sets up middleware, routes, and starts the server.
 */
const express = require("express");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 8080;

/**
 * Middleware to parse JSON request bodies.
 */
app.use(express.json());

/**
 * Health check endpoint to verify if the server is running.
 * @route GET /health
 * @returns {object} 200 - Server status with current local time.
 */
app.get("/health", (req, res) => {
  const currentTime = new Date().toLocaleString(); // Get local server time
  res
    .status(200)
    .json({ status: "UP", message: "Server is running!", time: currentTime });
});

/**
 * Mounts all application routes.
 * Routes are defined in the `/routes` directory.
 */
app.use("/", routes);

/**
 * Starts the Express server and logs the health check status.
 */
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
  console.log(`Health Check on http://localhost:${port}/health`);
});

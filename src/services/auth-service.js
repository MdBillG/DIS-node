const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

const AuthService = {
    login: async (email, password) => {

        await connectDB(); // Connect to the database
        try {
            // Find the user by email
            const user = await User.findOne({ email });

            if (!user) {
                return { success: false, message: "User not found" };
            }

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { success: false, message: "Invalid credentials" };
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, role: user.role }, // Include the user's role in the payload
                process.env.JWT_SECRET, // Secret key
                { expiresIn: "1h" } // Token expiration
            );

            // Return user details (excluding the password) and token
            const { password: _, ...userDetails } = user.toObject();
            return { success: true, data: { ...userDetails, token } };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error.message };
        } finally {
            await mongoose.connection.close(); // Close the connection
        }
    },
};

module.exports = AuthService;
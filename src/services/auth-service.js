const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");
const tokenRegistry = new Map();

const AuthService = {
  login: async (email, password) => {
    await connectDB();
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Invalid credentials" };
      }

      const tokenResponse = await AuthService.generateToken(email);
      if (!tokenResponse.success) {
        return { success: false, message: "Token generation failed" };
      }

      const { password: _, ...userDetails } = user.toObject();
      return { success: true, data: userDetails, token: tokenResponse.token };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },

  generateToken: async (email, expiresIn = "1h") => {
    await connectDB();
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const userId = user._id.toString();

      // Check if user has a valid token in the registry
      if (tokenRegistry.has(userId)) {
        const { token, expiry } = tokenRegistry.get(userId);
        if (new Date(expiry) > new Date()) {
          return { success: true, token };
        }
      }

      // Generate new token
      const token = jwt.sign(
        { id: userId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn }
      );

      // Calculate expiry time
      const expiry = new Date();
      const timeValue = parseInt(expiresIn);
      const timeUnit = expiresIn.slice(-1);

      if (timeUnit === "h") expiry.setHours(expiry.getHours() + timeValue);
      else if (timeUnit === "m")
        expiry.setMinutes(expiry.getMinutes() + timeValue);

      // Store in registry
      tokenRegistry.set(userId, { token, expiry });

      return { success: true, token };
    } catch (error) {
      console.error("Error generating token:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },
};

module.exports = AuthService;

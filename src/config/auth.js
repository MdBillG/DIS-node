const jwt = require("jsonwebtoken");

const AuthMiddleware = {
  authenticate: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user data to the request object
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  },
  verifyToken: (token) => {
    try {
      return !!jwt.verify(token, process.env.JWT_SECRET); // Returns true if valid, false if an error occurs
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  },
};

module.exports = AuthMiddleware;

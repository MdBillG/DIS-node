const AuthService = require("../services/auth-service");

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    // Call the AuthService to handle login logic
    const result = await AuthService.login(email, password);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: result.message || result.error });
    }
  },
  generateToken: async (req, res) => {
    const { email } = req.body;

    // Call the AuthService to generate a token
    const result = await AuthService.generateToken(email);

    if (result.success) {
      res.status(200).json({ token: result.token });
    } else {
      res.status(500).json({ message: "Token generation failed" });
    }
  },
};

module.exports = AuthController;

const AuthService = require("../services/auth-service");

const AuthController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        // Call the AuthService to handle login logic
        const result = await AuthService.login(email, password);

        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(400).json({ message: result.message || result.error });
        }
    }
};

module.exports = AuthController;
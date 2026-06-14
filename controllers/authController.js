const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const saltRounds = 10; // Độ phức tạp mã hoá (thường là 10-12)
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const userResponse = newUser.toJSON();

      res.status(201).json({
        message: "Register successfully",
        user: userResponse,
      });
    } catch (error) {
      // next(error);
    }
  },
};

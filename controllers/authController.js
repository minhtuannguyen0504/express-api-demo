const { User } = require("../models");
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

      delete userResponse.password;

      res.status(201).json({
        message: "Register successfully",
        user: userResponse,
      });
    } catch (error) {
      // Nếu username/email tồn tại
      if (error.name === "SequelizeUniqueConstraintError") {
        const field = error.errors[0].path;
        return res.status(409).json({
          message: "Register failed",
          error: [{ msg: `${field} is exist`, param: field }],
        });
      }

      // Xử lý lỗi validation từ sequelize (nếu có)
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => ({
          msg: err.message,
          param: err.path,
        }));
      }

      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { emailOrUsername, password } = req.body;
      const user = await User.scope("withPassword").findOne({
        where: {
          [require("sequelize").Op.or]: [
            { email: emailOrUsername },
            { username: emailOrUsername },
          ],
        },
      });

      if (!user) {
        return res.status(401).json({ message: "Bad request" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("MATCH:", isMatch);

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Username or password invalid" });
      }

      const payload = {
        userId: user.id,
      };

      const secretKey = process.env.JWT_SECRET;
      const expiresIn = process.env.JWT_EXPIRED_IN || "1h";
      const token = jwt.sign(payload, secretKey, { expiresIn });

      res.json({
        message: "Login successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

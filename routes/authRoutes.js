const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const handleValidationErrors = require("../middlewares/validationErrorHandler");

const registerValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is not empty")
      .isLength({ min: 3, max: 30 })
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("Email is not empty")
      .isEmail()
      .withMessage("Email is invalid")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is not empty")
      .isLength({ min: 6 })
      .withMessage("Passwords must be at least 6 characters long."),
  ];
};

const loginValidationRules = () => {
  return [
    body("emailOrUsername")
      .notEmpty()
      .withMessage("Email or username is not empty"),
    body("password").notEmpty().withMessage("Password is not empty"),
  ];
};

router.post(
  "/register",
  registerValidationRules(),
  handleValidationErrors,
  authController.register,
);

router.post(
  "/login",
  loginValidationRules(),
  handleValidationErrors,
  authController.login,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const categoryController = require("../controllers/categoryController");
const handleValidationErrors = require("../middlewares/validationErrorHandler");

// GET list
router.get("/", categoryController.getAll);

// GET by ID
router.get("/:id", categoryController.getById);

// POST create new category
router.post(
  "/",
  body("name").notEmpty().withMessage("Bad request").trim(),
  body("description")
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage("Bad request")
    .trim(),
  handleValidationErrors,
  categoryController.create,
);

// UPDATE
router.put("/:id", categoryController.update);

// DELETE
router.delete("/:id", categoryController.delete);

module.exports = router;

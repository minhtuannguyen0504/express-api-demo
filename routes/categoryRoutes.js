const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { body } = require("express-validator");

// GET list
router.get("/", categoryController.getAll);

// GET by ID
router.get("/:id", categoryController.getById);

// POST create new category
router.post(
  "/",
  body("name").notEmpty().withMessage("Bad request").trim(),
  categoryController.create,
);

// UPDATE
router.put("/:id", categoryController.update);

// DELETE
router.delete("/:id", categoryController.delete);

module.exports = router;

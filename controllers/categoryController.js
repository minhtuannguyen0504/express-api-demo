const { Category } = require("../models");
const { validationResult } = require("express-validator");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      return res.json(category);
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.errors[0].msg });
    }

    try {
      const newCategory = await Category.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const [updatedRow] = await Category.update(req.body, {
        where: { id: req.params.id },
      });
      if (updatedRow === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy danh mục để cập nhật" });
      }

      const updatedCategory = await Category.findByPk(req.params.id);
      res.json(updatedCategory);
    } catch (error) {
      next(json);
    }
  },
  delete: async (req, res, next) => {
    try {
      const deleteRows = await Category.destroy({
        where: { id: req.params.id },
      });

      if (deleteRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy danh mục để xoá" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

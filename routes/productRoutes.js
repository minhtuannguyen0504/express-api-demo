const express = require("express");
const router = express.Router();
const { Product } = require("../models");

// GET List
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET Detail
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
});

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const { name, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const newProduct = await Product.create(req.body);

    return res.json(newProduct);
  } catch (error) {
    next(error);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const updatedProduct = await Product.update(req.body, { where: { id } });
    
    if (updatedProduct[0] === 0) {
      return res.status(400).json({ message: "Bad request" })
    }

    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    await Product.destroy({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

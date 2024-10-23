const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/", async (req, res) => {
  console.log("Received GET request for products");
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).send(err.message);
    }
  }
});

// Add a new product
router.post("/", async (req, res) => {
  console.log("Request body for new product:", req.body); // Log the incoming request body
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ message: "Name and price are required." });
  }
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    model: req.body.model,
    description: req.body.description,
  });

  try {
    const savedProduct = await product.save();
    return res.status(201).json(savedProduct); // Return created product as JSON
  } catch (err) {
    return res.status(400).send(err.message); // Return error message
  }
});

// Edit a product by ID
router.put("/:id", async (req, res) => {
  console.log("Updating product ID:", req.params.id); // Log the ID being updated
  console.log("Request body:", req.body); // Log the request body
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      console.log("Product not found for ID:", req.params.id);
      return res.status(404).send("Product not found");
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(400).send(err.message);
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  console.log("Deleting product ID:", req.params.id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

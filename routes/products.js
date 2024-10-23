const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // MongoDB მოდელი

// Get all products
router.get("/", async (req, res) => {
  console.log("Received GET request for products"); // Log the request
  try {
    const products = await Product.find();
    console.log("Fetched Products:", products); // Log the fetched products
    return res.json(products); // Return products as JSON
  } catch (err) {
    console.error("Error fetching products:", err); // Log the error
    if (!res.headersSent) {
      return res.status(500).send(err.message); // Send error message
    }
  }
});

// Add a new product
router.post("/", async (req, res) => {
  console.log("Request body for new product:", req.body); // Log the incoming request body
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    model: req.body.model,
    description: req.body.description,
  });

  try {
    const savedProduct = await product.save();
    console.log("Saved Product:", savedProduct); // Log the saved product
    return res.status(201).json(savedProduct); // Return created product as JSON
  } catch (err) {
    console.error("Error saving product:", err); // Log the error
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
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedProduct) {
      console.log("Product not found for ID:", req.params.id); // Log if product not found
      return res.status(404).send("Product not found");
    }

    res.json(updatedProduct); // Return updated product
  } catch (err) {
    console.error("Error updating product:", err); // Log the error
    res.status(400).send(err.message); // Return error message
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  console.log("Deleting product ID:", req.params.id); // Log the ID being deleted
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      console.log("Product not found for ID:", req.params.id); // Log if product not found
      return res.status(404).send("Product not found");
    }

    res.json({ message: "Product deleted successfully" }); // Return success message
  } catch (err) {
    console.error("Error deleting product:", err); // Log the error
    res.status(500).send(err.message); // Return error message
  }
});

module.exports = router;

const Product = require("../models/product.model");

const productService = {
  // Create a new product
  async createProduct(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  },

  // Get all products
  async getAllProducts() {
    return await Product.find().populate("category");
  },

  // Get a product by ID
  async getProductById(productId) {
    return await Product.findById(productId).populate("category");
  },

  // Update a product
  async updateProduct(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    });
  },

  // Delete a product
  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  },
};

module.exports = productService;

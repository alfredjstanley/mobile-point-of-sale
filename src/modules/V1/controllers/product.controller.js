const productService = require("../services/product.service");
const responseHandler = require("../../../handlers/response.handler");

const productController = {
  // Create a new product
  async createProduct(req, res) {
    try {
      const responseData = await productService.createProduct(req.body);
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  // Get all products
  async getAllProducts(req, res) {
    try {
      const results = await productService.getAllProducts();
      responseHandler.sendSuccessResponse(res, results);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  // Get a product by ID
  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update a product
  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product updated", product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const product = await productService.deleteProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = productController;

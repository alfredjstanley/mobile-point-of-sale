const categoryService = require("../services/category.service");
const responseHandler = require("../../../handlers/response.handler");

const categoryController = {
  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      responseHandler.sendSuccessResponse(res, category);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  async getAllCategories(_, res) {
    try {
      const categories = await categoryService.getAllCategories();
      responseHandler.sendSuccessResponse(res, categories);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  // Get a category by ID
  async getCategory(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update a category
  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ message: "Category updated", category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a category
  async deleteCategory(req, res) {
    try {
      const category = await categoryService.deleteCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = categoryController;

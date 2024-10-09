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

  async updateCategory(req, res) {
    const { categoryData } = req.body;
    const categoryId = categoryData.id;

    delete categoryData.id;

    try {
      const category = await categoryService.updateCategory(
        categoryId,
        categoryData
      );
      if (!category)
        return res.status(404).json({ error: "Category not found" });
      responseHandler.sendSuccessResponse(res, category);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },
};

module.exports = categoryController;

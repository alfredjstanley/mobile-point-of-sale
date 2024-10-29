const { categoryService } = require("../../services/master");
const { responseHandler } = require("../../../../handlers");

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = req.identifier;

      data.storeId = storeId;
      data.createdBy = userId;

      const category = await categoryService.createCategory(data);

      responseHandler.sendCreatedResponse(res, category);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const { storeId } = req.identifier;
      const categories = await categoryService.getCategories({
        storeId,
        status: "ACTIVE",
      });
      responseHandler.sendSuccessResponse(res, categories);
    } catch (error) {
      next(error);
    }
  }

  // Get a category by ID
  async getCategoryById(req, res, next) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        return responseHandler.sendFailureResponse(
          res,
          "Category ID is required"
        );
      }
      const category = await categoryService.getCategoryById(categoryId);
      if (!category) {
        return responseHandler.sendNotFoundResponse(res, "Category not found");
      }

      responseHandler.sendSuccessResponse(res, category);
    } catch (error) {
      next(error);
    }
  }

  // Update a category by ID
  async updateCategory(req, res, next) {
    try {
      const data = req.body;

      const categoryId = req.params.id;
      if (!categoryId) {
        return responseHandler.sendFailureResponse(
          res,
          "Category ID is required"
        );
      }
      const { userId } = req.identifier;
      data.modifiedBy = userId;

      const category = await categoryService.updateCategory(categoryId, data);
      if (!category) {
        return responseHandler.sendNotFoundResponse(res, "Category not found");
      }
      responseHandler.sendSuccessResponse(res, category);
    } catch (error) {
      next(error);
    }
  }

  // Delete a category by ID
  async deleteCategory(req, res, next) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        return responseHandler.sendFailureResponse(
          res,
          "Category ID is required"
        );
      }
      const category = await categoryService.deleteCategory(categoryId);
      if (!category) {
        return responseHandler.sendNotFoundResponse(res, "Category not found");
      }
      responseHandler.sendSuccessResponse(res, category);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();

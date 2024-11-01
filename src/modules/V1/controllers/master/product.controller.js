const { productService } = require("../../services/master");
const { responseHandler } = require("../../../../handlers");
const { ProductDTO } = require("../../dtos/master");

class ProductController {
  async createProduct(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = req.identifier;

      data.storeId = storeId;
      data.createdBy = userId;

      const product = await productService.createProduct(data);

      responseHandler.sendCreatedResponse(res, product);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const { storeId } = req.identifier;
      const products = await productService.getProducts({
        storeId,
        status: "ACTIVE",
      });
      responseHandler.sendSuccessResponse(res, products, ProductDTO);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const productId = req.params.id;
      if (!productId) {
        return responseHandler.sendFailureResponse(
          res,
          "Product ID is required"
        );
      }
      const product = await productService.getProductById(productId);
      if (!product) {
        return responseHandler.sendNotFoundResponse(res, "Product not found");
      }

      responseHandler.sendSuccessResponse(res, product);
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategory(req, res, next) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        return responseHandler.sendFailureResponse(
          res,
          "Category ID is required"
        );
      }
      const products = await productService.getProductsByCategory(categoryId);
      responseHandler.sendSuccessResponse(res, products, ProductDTO);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const data = req.body;

      const productId = req.params.id;
      if (!productId) {
        return responseHandler.sendFailureResponse(
          res,
          "Product ID is required"
        );
      }
      const { userId } = req.identifier;
      data.modifiedBy = userId;

      const product = await productService.updateProduct(productId, data);
      if (!product) {
        return responseHandler.sendNotFoundResponse(res, "Product not found");
      }
      responseHandler.sendSuccessResponse(res, product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const productId = req.params.id;
      if (!productId) {
        return responseHandler.sendFailureResponse(
          res,
          "Product ID is required"
        );
      }
      const product = await productService.deleteProduct(productId);
      if (!product) {
        return responseHandler.sendNotFoundResponse(res, "Product not found");
      }
      responseHandler.sendSuccessResponse(res, product);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();

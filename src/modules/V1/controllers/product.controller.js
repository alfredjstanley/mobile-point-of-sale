const productService = require("../services/product.service");
const responseHandler = require("../../../handlers/response.handler");

const {
  getUserId,
  getStoreId,
  getUserStoreIds,
} = require("../services/auth.service");

class ProductController {
  async createProduct(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = await getUserStoreIds(req.identifier);

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
      const { storeId } = await getStoreId(req.identifier);
      const products = await productService.getProducts({
        storeId,
        status: "ACTIVE",
      });
      responseHandler.sendSuccessResponse(res, products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const productId = req.params.id;
      if (!productId) {
        return responseHandler.sendBadRequest(res, "Product ID is required");
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

  async updateProduct(req, res, next) {
    try {
      const data = req.body;

      const productId = req.params.id;
      if (!productId) {
        return responseHandler.sendBadRequest(res, "Product ID is required");
      }
      const { userId } = await getUserId(req.identifier);
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
        return responseHandler.sendBadRequest(res, "Product ID is required");
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

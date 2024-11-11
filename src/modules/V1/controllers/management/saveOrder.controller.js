const service = require("../../services/management/savedOrder.service");
const { responseHandler } = require("../../../../handlers");

class SaveOrderController {
  async createSavedOrder(req, res, next) {
    try {
      const { storeId, userId, storeNumber } = req.identifier;
      const data = { ...req.body, storeId, storeNumber, createdBy: userId };

      const order = await service.createSavedOrder(data);

      responseHandler.sendCreatedResponse(res, order);
    } catch (error) {
      next(error);
    }
  }

  async updateSavedOrder(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const result = await service.updateSavedOrder(id, data);

      responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const { storeId } = req.identifier;
      const orders = await service.getAllSavedOrders({ storeId });
      responseHandler.sendSuccessResponse(res, orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const orderId = req.params.id;
      if (!orderId) {
        return responseHandler.sendFailureResponse(res, "Order ID is required");
      }
      const order = await service.getSavedOrderById(orderId);
      if (!order) {
        return responseHandler.sendNotFoundResponse(res, "Order not found");
      }

      responseHandler.sendSuccessResponse(res, order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaveOrderController();

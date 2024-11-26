const { purchaseService } = require("../../services/transaction");
const { responseHandler } = require("../../../../handlers");

const { getStoreId, retrieveUserByKey } = require("../../services/core").authService;

class PurchaseController {
  async createPurchase(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = await retrieveUserByKey(req.identifier);

      data.storeId = storeId;
      data.createdBy = userId;

      const purchase = await purchaseService.createPurchase(data);

      responseHandler.sendCreatedResponse(res, purchase);
    } catch (error) {
      next(error);
    }
  }

  async getPurchases(req, res, next) {
    try {
      const { storeId } = await getStoreId(req.identifier);
      const purchases = await purchaseService.getPurchases({
        storeId,
      });
      responseHandler.sendSuccessResponse(res, purchases);
    } catch (error) {
      next(error);
    }
  }

  async getPurchaseById(req, res, next) {
    try {
      const purchaseId = req.params.id;
      if (!purchaseId) {
        return responseHandler.sendFailureResponse(
          res,
          "Purchase ID is required"
        );
      }
      const purchase = await purchaseService.getPurchaseById(purchaseId);
      if (!purchase) {
        return responseHandler.sendNotFoundResponse(res, "Purchase not found");
      }

      responseHandler.sendSuccessResponse(res, purchase);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PurchaseController();

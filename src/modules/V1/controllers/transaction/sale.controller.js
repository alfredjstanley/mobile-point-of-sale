const { saleService } = require("../../services/transaction");
const { responseHandler } = require("../../../../handlers");
const { storeService } = require("../../services/core");

const {
  reflectUserMerchantPointsInWac,
} = require("../../services/thirdPartyAPI");

class SaleController {
  async createSale(req, res, next) {
    try {
      const { storeId, userId, storeNumber } = req.identifier;
      const data = { ...req.body, storeId, storeNumber, createdBy: userId };

      const [sale, store] = await Promise.all([
        saleService.createSale(data),
        storeService.getStoreById(storeId),
      ]);

      if (store.existsInWac) {
        // Reflect user merchant points in WAC
        reflectUserMerchantPointsInWac(store, sale);
      }

      responseHandler.sendCreatedResponse(res, sale.data);
    } catch (error) {
      next(error);
    }
  }

  async getSales(req, res, next) {
    try {
      const { storeId } = req.identifier;
      const sales = await saleService.getAllSales({
        storeId,
      });
      responseHandler.sendSuccessResponse(res, sales);
    } catch (error) {
      next(error);
    }
  }

  async getSaleById(req, res, next) {
    try {
      const saleId = req.params.id;
      if (!saleId) {
        return responseHandler.sendFailureResponse(res, "Sale ID is required");
      }
      const sale = await saleService.getSaleById(saleId);
      if (!sale) {
        return responseHandler.sendNotFoundResponse(res, "Sale not found");
      }

      responseHandler.sendSuccessResponse(res, sale);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaleController();

const { saleService } = require("../../services/transaction");
const { responseHandler } = require("../../../../handlers");

class SaleController {
  async createSale(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = req.identifier;

      data.storeId = storeId;
      data.createdBy = userId;

      const sale = await saleService.createSale(data);

      responseHandler.sendCreatedResponse(res, sale);
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

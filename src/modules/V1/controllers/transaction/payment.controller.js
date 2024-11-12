const { creditPaymentService } = require("../../services/transaction");
const { responseHandler } = require("../../../../handlers");

class CreditPaymentController {
  async createCreditPayment(req, res, next) {
    try {
      const { storeId, userId } = req.identifier;

      const { customerId, amount, paymentMethod, reference } = req.body;

      const creditPayment = await creditPaymentService.recordCreditPayment({
        storeId,
        customerId,
        amount,
        paymentMethod,
        reference,
        createdBy: userId,
      });

      responseHandler.sendCreatedResponse(res, creditPayment);
    } catch (error) {
      next(error);
    }
  }

  async getCreditPayments(req, res, next) {
    try {
      const { storeId } = req.identifier;
      const creditPayments = await creditPaymentService.getAllCreditPayments({
        storeId,
      });
      responseHandler.sendSuccessResponse(res, creditPayments);
    } catch (error) {
      next(error);
    }
  }

  async getCreditPaymentById(req, res, next) {
    try {
      const creditPaymentId = req.params.id;
      if (!creditPaymentId) {
        return responseHandler.sendFailureResponse(
          res,
          "Credit Payment ID is required"
        );
      }
      const creditPayment = await creditPaymentService.getCreditPaymentById(
        creditPaymentId
      );
      if (!creditPayment) {
        return responseHandler.sendNotFoundResponse(
          res,
          "Credit Payment not found"
        );
      }

      responseHandler.sendSuccessResponse(res, creditPayment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CreditPaymentController();

const router = require("express").Router();

const handler = require("../../controllers/transaction/payment.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");
const {
  createCreditPaymentValidator,
} = require("../../validators/payment.validator");

const handleValidationErrors = require("../../../../handlers/request.handler");

router.post(
  "/",
  authMiddleware,
  createCreditPaymentValidator,
  handleValidationErrors,
  handler.createCreditPayment
);

module.exports = router;

const { body } = require("express-validator");

exports.createCreditPaymentValidator = [
  body("customerId")
    .notEmpty()
    .withMessage("customerId is required")
    .isMongoId()
    .withMessage("customerId must be a valid ID"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment Method is required")
    .isIn(["CASH", "CARD", "UPI", "CREDIT"])
    .withMessage("Invalid payment type"),
];

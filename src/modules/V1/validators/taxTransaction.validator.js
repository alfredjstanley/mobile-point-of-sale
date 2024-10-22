const { body } = require("express-validator");

exports.createTaxTransactionValidator = [
  body("transactionType")
    .notEmpty()
    .withMessage("Transaction type is required")
    .isIn(["PURCHASE", "PURCHASE_RETURN", "SALE", "SALE_RETURN"])
    .withMessage("Invalid transaction type"),
  body("transactionMasterId")
    .notEmpty()
    .withMessage("Transaction master ID is required")
    .isMongoId()
    .withMessage("Invalid transaction master ID"),
  body("transactionDate")
    .notEmpty()
    .withMessage("Transaction date is required")
    .isISO8601()
    .withMessage("Invalid transaction date"),
  body("transactionDirection")
    .notEmpty()
    .withMessage("Transaction direction is required")
    .isIn(["IN", "OUT"])
    .withMessage("Invalid transaction direction"),
  body("taxId")
    .notEmpty()
    .withMessage("Tax ID is required")
    .isMongoId()
    .withMessage("Invalid tax ID"),
  body("taxPercentage")
    .notEmpty()
    .withMessage("Tax percentage is required")
    .isNumeric()
    .withMessage("Tax percentage must be a number"),
  body("taxAmount")
    .notEmpty()
    .withMessage("Tax amount is required")
    .isNumeric()
    .withMessage("Tax amount must be a number"),
  body("accountId")
    .notEmpty()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),
  body("taxableAmount")
    .notEmpty()
    .withMessage("Taxable amount is required")
    .isNumeric()
    .withMessage("Taxable amount must be a number"),
];

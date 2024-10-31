const { body } = require("express-validator");

exports.createSaleValidator = [
  body("saleInvoiceId").notEmpty().withMessage("Sale invoice ID is required"),
  body("customer")
    .notEmpty()
    .withMessage("Customer is required")
    .isMongoId()
    .withMessage("Customer must be a valid ID"),
  body("dateOfInvoice")
    .notEmpty()
    .withMessage("Date of invoice is required")
    .isISO8601()
    .withMessage("Date of invoice must be a valid date"),
  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isNumeric()
    .withMessage("Total amount must be a number"),
  body("taxAmount")
    .notEmpty()
    .withMessage("Tax amount is required")
    .isNumeric()
    .withMessage("Tax amount must be a number"),
  body("saleType")
    .notEmpty()
    .withMessage("Sale type is required")
    .isIn(["NORMAL", "QUICK-SALE", "RETURN", "HYBRID"])
    .withMessage("Sale type must be NORMAL, HYBRID, QUICK-SALE or RETURN"),
  body("paymentType")
    .notEmpty()
    .withMessage("Payment type is required")
    .isIn(["CASH", "CARD", "UPI", "CREDIT"])
    .withMessage("Invalid payment type"),
  body("saleDetails")
    .isArray({ min: 1 })
    .withMessage("Sale details must be an array with at least one item"),
  body("saleDetails.*.item")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid ID"),
  body("saleDetails.*.unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isMongoId()
    .withMessage("Unit must be a valid ID"),
  body("saleDetails.*.tax")
    .notEmpty()
    .withMessage("product tax is required")
    .isMongoId()
    .withMessage("Product tax must be a valid ID"),
  body("saleDetails.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  body("saleDetails.*.totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isNumeric()
    .withMessage("Total amount must be a number"),
  body("saleDetails.*.taxAmount")
    .notEmpty()
    .withMessage("Tax amount is required")
    .isNumeric()
    .withMessage("Tax amount must be a number"),
  body("saleDetails.*.taxAmount")
    .notEmpty()
    .withMessage("taxAmount is required")
    .isNumeric()
    .withMessage("Tax amount must be a number"),
];

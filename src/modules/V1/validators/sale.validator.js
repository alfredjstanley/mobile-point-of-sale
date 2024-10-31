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
  body("paymentType")
    .notEmpty()
    .withMessage("Payment type is required")
    .isIn(["CASH", "CARD", "UPI", "CREDIT"])
    .withMessage("Invalid payment type"),
  body("saleDetails")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Sale details must be an array with at least one item"),
  body("saleDetails.*.item")
    .optional()
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid ID"),
  body("saleDetails.*.unit")
    .optional()
    .notEmpty()
    .withMessage("Unit is required")
    .isMongoId()
    .withMessage("Unit must be a valid ID"),
  body("saleDetails.*.tax")
    .optional()
    .notEmpty()
    .withMessage("Product tax is required")
    .isMongoId()
    .withMessage("Product tax must be a valid ID"),
  body("saleDetails.*.quantity")
    .optional()
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  body("saleDetails.*.totalAmount")
    .optional()
    .notEmpty()
    .withMessage("Total amount is required")
    .isNumeric()
    .withMessage("Total amount must be a number"),
  body("saleDetails.*.taxAmount")
    .optional()
    .notEmpty()
    .withMessage("Tax amount is required")
    .isNumeric()
    .withMessage("Tax amount must be a number"),
];

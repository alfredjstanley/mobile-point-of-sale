const { body } = require("express-validator");

exports.createPurchaseValidator = [
  body("purchaseInvoiceId")
    .notEmpty()
    .withMessage("Purchase invoice ID is required"),
  body("supplier")
    .notEmpty()
    .withMessage("Supplier is required")
    .isMongoId()
    .withMessage("Supplier must be a valid ID"),
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
  body("purchaseType")
    .notEmpty()
    .withMessage("Purchase type is required")
    .isIn(["LOCAL", "IMPORT"])
    .withMessage("Purchase type must be LOCAL or IMPORT"),
  body("paymentType")
    .notEmpty()
    .withMessage("Payment type is required")
    .isIn(["CASH", "CARD", "ONLINE", "CREDIT"])
    .withMessage("Invalid payment type"),
  body("purchaseDetails")
    .isArray({ min: 1 })
    .withMessage("Purchase details must be an array with at least one item"),
  body("purchaseDetails.*.item")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid ID"),
  body("purchaseDetails.*.unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isMongoId()
    .withMessage("Unit must be a valid ID"),
  body("purchaseDetails.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  body("purchaseDetails.*.totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isNumeric()
    .withMessage("Total amount must be a number"),
  body("purchaseDetails.*.taxAmount")
    .notEmpty()
    .withMessage("Tax amount is required")
    .isNumeric()
    .withMessage("Tax amount must be a number"),
];

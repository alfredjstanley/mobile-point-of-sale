const { body, param } = require("express-validator");

exports.createSavedOrderValidator = [
  body("customer")
    .notEmpty()
    .withMessage("Customer is required")
    .isMongoId()
    .withMessage("Customer must be a valid ID"),

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

  body("saleDetails")
    .isArray()
    .withMessage("Sale details required and it must be an array "),

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

  body("quickSaleDetails")
    .isArray()
    .withMessage("Quick sale details required and it must be an array "),

  body("quickSaleDetails.*.itemName")
    .optional()
    .notEmpty()
    .withMessage("Item name is required"),

  body("quickSaleDetails.*.quantity")
    .optional()
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),

  body("quickSaleDetails.*.amount")
    .optional()
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),

  body("notes").optional().isString().withMessage("Notes must be a string"),
  body("orderId").notEmpty().withMessage("Sale order ID is required"),

  body("dateCreated")
    .optional()
    .isISO8601()
    .withMessage("Date created must be a valid date"),

  body("validUntil")
    .optional()
    .isISO8601()
    .withMessage("Valid until must be a valid date"),
];

exports.updateSavedOrderValidator = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Order ID must be a valid ID"),

  body("customer")
    .optional()
    .isMongoId()
    .withMessage("Customer must be a valid ID"),

  body("totalAmount")
    .optional()
    .isNumeric()
    .withMessage("Total amount must be a number"),

  body("taxAmount")
    .optional()
    .isNumeric()
    .withMessage("Tax amount must be a number"),

  body("saleDetails")
    .optional()
    .isArray()
    .withMessage("Sale details must be an array"),

  body("saleDetails.*.item")
    .optional()
    .isMongoId()
    .withMessage("Product must be a valid ID"),

  body("saleDetails.*.unit")
    .optional()
    .isMongoId()
    .withMessage("Unit must be a valid ID"),

  body("saleDetails.*.tax")
    .optional()
    .isMongoId()
    .withMessage("Product tax must be a valid ID"),

  body("saleDetails.*.quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number"),

  body("saleDetails.*.totalAmount")
    .optional()
    .isNumeric()
    .withMessage("Total amount must be a number"),

  body("saleDetails.*.taxAmount")
    .optional()
    .isNumeric()
    .withMessage("Tax amount must be a number"),

  body("quickSaleDetails")
    .optional()
    .isArray()
    .withMessage("Quick sale details must be an array"),

  body("quickSaleDetails.*.itemName")
    .optional()
    .isString()
    .withMessage("Item name must be a string"),

  body("quickSaleDetails.*.quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number"),

  body("quickSaleDetails.*.amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number"),

  body("notes").optional().isString().withMessage("Notes must be a string"),

  body("orderStatus")
    .optional()
    .isIn(["Pending", "Confirmed", "Cancelled"])
    .withMessage("Invalid order status"),

  body("validUntil")
    .optional()
    .isISO8601()
    .withMessage("Valid until must be a valid date"),
];

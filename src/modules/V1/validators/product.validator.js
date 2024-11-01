const { body } = require("express-validator");

exports.createProductValidator = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("sellingPrice")
    .notEmpty()
    .withMessage("Selling price is required")
    .isNumeric()
    .withMessage("Selling price must be a number"),
  body("stockQuantity")
    .optional()
    .isNumeric()
    .withMessage("Stock Quantityt must be a number"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  body("unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isMongoId()
    .withMessage("Unit must be a valid ID"),
  body("tax").notEmpty().withMessage("Tax is required"),
];

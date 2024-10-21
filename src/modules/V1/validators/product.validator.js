const { body } = require("express-validator");

exports.createProductValidator = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("productCode").notEmpty().withMessage("Product code is required"),
  body("sellingPrice")
    .notEmpty()
    .withMessage("Selling price is required")
    .isNumeric()
    .withMessage("Selling price must be a number"),
  body("purchaseCost")
    .notEmpty()
    .withMessage("Purchase cost is required")
    .isNumeric()
    .withMessage("Purchase cost must be a number"),
  body("tax")
    .notEmpty()
    .withMessage("Tax is required")
    .isNumeric()
    .withMessage("Tax must be a number"),
  body("unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isMongoId()
    .withMessage("Unit must be a valid ID"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid ID"),
];

const { body } = require("express-validator");

exports.createCategoryValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("code").notEmpty().withMessage("Code is required"),
];

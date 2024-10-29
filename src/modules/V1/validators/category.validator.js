const { body } = require("express-validator");

exports.createCategoryValidator = [
  body("name").notEmpty().withMessage("Name is required"),
];

const { body } = require("express-validator");

exports.createUnitValidator = [
  body("name").notEmpty().withMessage("Unit name is required"),
  body("unitCode").notEmpty().withMessage("Unit code is required"),
];

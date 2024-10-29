const { body } = require("express-validator");

exports.createAccountValidator = [
  body("name").notEmpty().withMessage("Account name is required"),
  body("accountType")
    .notEmpty()
    .withMessage("Account type is required")
    .isIn(["CUSTOMER", "SUPPLIER"])
    .withMessage("Type must be CUSTOMER or SUPPLIER"),
  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("creditLimit")
    .optional()
    .isNumeric()
    .withMessage("Credit limit must be a number"),
];

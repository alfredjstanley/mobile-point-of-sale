const { body } = require("express-validator");

exports.createAccountValidator = [
  body("name").notEmpty().withMessage("Account name is required"),
  //   body("mobileNumber").notEmpty().withMessage("mobile number is required"),
  //   body("type")
  //     .notEmpty()
  //     .withMessage("Account type is required")
  //     .isIn(["CUSTOMER", "SUPPLIER"])
  //     .withMessage("Type must be CUSTOMER or SUPPLIER"),
  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  //   body("balance")
  //     .optional()
  //     .isNumeric()
  //     .withMessage("Balance must be a number"),
  body("creditLimit")
    .optional()
    .isNumeric()
    .withMessage("Credit limit must be a number"),
];

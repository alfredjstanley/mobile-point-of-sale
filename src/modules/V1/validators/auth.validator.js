const { body } = require("express-validator");
const { param } = require("express-validator");

exports.registerValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
  body("mpin")
    .notEmpty()
    .withMessage("MPIN is required")
    .isNumeric()
    .withMessage("MPIN must be a number"),
];

exports.resetMpinValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
  body("mpin")
    .notEmpty()
    .withMessage("MPIN is required")
    .isNumeric()
    .withMessage("MPIN must be a number"),
];

exports.verifyUserValidator = [
  param("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
];

exports.loginValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
  body("mpin")
    .notEmpty()
    .withMessage("MPIN is required")
    .isNumeric()
    .withMessage("MPIN must be a number"),
];

exports.addStaffValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
  body("mpin")
    .notEmpty()
    .withMessage("MPIN is required")
    .isNumeric()
    .withMessage("MPIN must be a number"),
  body("name").notEmpty().withMessage("Name is required"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["Administrator", "Staff", "Normal"])
    .withMessage("Invalid role type"),
];

exports.getStaffByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Staff ID is required")
    .isMongoId()
    .withMessage("Invalid Staff ID format"),
];

exports.updateStaffValidator = [
  param("id")
    .notEmpty()
    .withMessage("Staff ID is required")
    .isMongoId()
    .withMessage("Invalid Staff ID format"),
  body("name").optional(),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"])
    .withMessage("Invalid status type"),
  body("role")
    .optional()
    .isIn(["Administrator", "Staff", "Normal"])
    .withMessage("Invalid role type"),
  body("mpin").optional().isNumeric().withMessage("MPIN must be a number"),
];

const HTTP_STATUS = require("../utils/httpStatus.util");
const { validationResult } = require("express-validator");

// Middleware for handling validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: errors.array(),
    });
  }
  next();
}

module.exports = handleValidationErrors;

const HTTP_STATUS = require("../utils/httpStatus.util");

function _toDTO(dtoClass, data) {
  if (Array.isArray(data)) {
    return data.map((item) => new dtoClass(item));
  }
  return new dtoClass(data);
}

/**
 * Send a created response
 * @param {Object} res - Express response object
 * @param {Array} data - Data to send in the response
 * @param {Class} dtoClass - DTO class
 * @returns {Object} - The response object
 * @example
 * sendCreatedResponse(res, data, DTOClass);
 * @example
 * sendCreatedResponse(res, data);
 * @example
 * sendCreatedResponse(res);
 */
function sendCreatedResponse(res, data = [], dtoClass = null) {
  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: dtoClass ? _toDTO(dtoClass, data) : data,
  });
}

// Send a no content response
function sendNoContentResponse(res) {
  return res.status(HTTP_STATUS.NO_CONTENT).json({
    success: true,
  });
}

// Send a not found response
function sendNotFoundResponse(res, error) {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: error,
  });
}

// Send a accepted response
function sendAcceptedResponse(res, data = []) {
  return res.status(HTTP_STATUS.ACCEPTED).json({
    success: true,
    data: data,
  });
}

// Send a bad request response
function sendBadRequestResponse(res, error) {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    error: error,
  });
}

// Send an internal server error response
function sendInternalServerError(res, error) {
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error,
  });
}

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {Array} data - Data to send in the response
 * @param {Class} dtoClass - DTO class to map the data
 * @returns {Object} - The response object
 * @example
 * sendSuccessResponse(res, data, DTOClass);
 * @example
 * sendSuccessResponse(res, data);
 * @example
 * sendSuccessResponse(res);
 */
function sendSuccessResponse(res, data = [], dtoClass = null) {
  return res.status(HTTP_STATUS.SUCCESS).json({
    success: true,
    data: dtoClass ? _toDTO(dtoClass, data) : data,
  });
}

// Send a success failure response
function sendFailureResponse(res, error) {
  return res.status(HTTP_STATUS.SUCCESS).json({
    success: false,
    data: { message: error },
  });
}

module.exports = {
  sendInternalServerError,
  sendNoContentResponse,
  sendNotFoundResponse,
  sendAcceptedResponse,
  sendCreatedResponse,
  sendSuccessResponse,
  sendFailureResponse,
  sendBadRequestResponse,
};

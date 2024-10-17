const HTTP_STATUS = require("../utils/httpStatus.util");

// Send a created response
function sendCreatedResponse(res, data = []) {
  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: data,
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

// Send a success response
function sendSuccessResponse(res, data = []) {
  return res.status(HTTP_STATUS.SUCCESS).json({
    success: true,
    data: data,
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

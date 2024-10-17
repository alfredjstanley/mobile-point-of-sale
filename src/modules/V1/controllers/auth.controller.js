const authService = require("../services/auth.service");
const responseHandler = require("../../../handlers/response.handler");

function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+91\s?[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

function validateMpin(mpin) {
  const mpinRegex = /^\d{4}$/;
  return mpinRegex.test(mpin);
}

function getPhoneNumberAndMpin(req) {
  const { phoneNumber, mpin } = req.body;
  if (!phoneNumber || !mpin) {
    throw new Error("PhoneNumber and PIN required.");
  }

  if (!validatePhoneNumber(phoneNumber)) {
    throw new Error("Please enter a valid phone number");
  }

  if (!validateMpin(mpin)) {
    throw new Error("Please enter a valid MPIN");
  }

  return { phoneNumber, mpin };
}

const authController = {
  async register(req, res) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.register({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  async resetMpin(req, res) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.resetMpin({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  async verifyUser(req, res) {
    try {
      const phoneNumber = req.params.phoneNumber;

      if (!phoneNumber) {
        throw new Error("PhoneNumber required.");
      }

      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      const responseData = await authService.verifyUser({ phoneNumber });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  async signIn(req, res) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.signIn({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  async addUser(req, res) {
    try {
      const responseData = await authService.addUser(req.body);
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  // Get user by ID
  async getUser(req, res) {
    try {
      const responseData = await authService.getUserById(req.query.id);
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  // Get users
  async getUsers(req, res) {
    try {
      const responseData = await authService.getUsers();
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },
};

module.exports = authController;

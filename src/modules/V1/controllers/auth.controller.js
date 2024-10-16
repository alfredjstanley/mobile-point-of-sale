const authService = require("../services/auth.service");
const responseHandler = require("../../../handlers/response.handler");

const authController = {
  async register(req, res) {
    try {
      const { phoneNumber, mpin } = req.body;
      if (!phoneNumber || !mpin)
        throw new Error("PhoneNumber and PIN required.");

      const responseData = await authService.register({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  async resetMpin(req, res) {
    try {
      const { phoneNumber, mpin } = req.body;
      if (!phoneNumber || !mpin)
        throw new Error("PhoneNumber and PIN required.");

      const responseData = await authService.resetMpin({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },
  async signUp(req, res) {
    try {
      const responseData = await authService.signUp(req.body);
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  async login(req, res) {
    try {
      const responseData = await authService.login(req.body);
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  // Handle adding a new user
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

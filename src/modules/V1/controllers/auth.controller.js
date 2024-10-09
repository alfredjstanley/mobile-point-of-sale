const authService = require("../services/auth.service");
const responseHandler = require("../../../handlers/response.handler");

const authController = {
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
      const user = await userService.addUser(req.body);
      res.status(201).json({ message: "User added successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get user by ID
  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({ message: "User updated", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = authController;

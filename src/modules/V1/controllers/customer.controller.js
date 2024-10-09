const customerService = require("../services/customer.service");
const responseHandler = require("../../../handlers/response.handler");

const customerController = {
  // Create a new customer
  async createCustomer(req, res) {
    try {
      const customer = await customerService.createCustomer(req.body);
      responseHandler.sendSuccessResponse(res, customer);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },

  // Get all customers
  async getAllCustomers(req, res) {
    try {
      const customers = await customerService.getAllCustomers();
      responseHandler.sendSuccessResponse(res, customers);
    } catch (error) {
      responseHandler.sendBadRequest(res, error.message);
    }
  },
};

module.exports = customerController;

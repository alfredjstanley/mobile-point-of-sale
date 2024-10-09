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

  // Get a customer by ID
  async getCustomer(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json({ customer });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update a customer
  async updateCustomer(req, res) {
    try {
      const customer = await customerService.updateCustomer(
        req.params.id,
        req.body
      );
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json({ message: "Customer updated", customer });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a customer
  async deleteCustomer(req, res) {
    try {
      const customer = await customerService.deleteCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json({ message: "Customer deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = customerController;

const Customer = require("../models/customer.model");

const customerService = {
  // Create a new customer
  async createCustomer(customerData) {
    const customer = new Customer(customerData);
    await customer.save();
    return {
      message: "Customer created successfully",
      customer,
    };
  },

  // Get all customers
  async getAllCustomers() {
    return await Customer.find();
  },

  // Get a customer by ID
  async getCustomerById(customerId) {
    return await Customer.findById(customerId);
  },

  // Update a customer
  async updateCustomer(customerId, updateData) {
    return await Customer.findByIdAndUpdate(customerId, updateData, {
      new: true,
    });
  },

  // Delete a customer
  async deleteCustomer(customerId) {
    return await Customer.findByIdAndDelete(customerId);
  },
};

module.exports = customerService;

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
};

module.exports = customerService;

const customerRouter = require("express").Router();
const handler = require("../controllers/customer.controller");

customerRouter.post("/", handler.createCustomer);
customerRouter.get("/", handler.getAllCustomers);

module.exports = customerRouter;

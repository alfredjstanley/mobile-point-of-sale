const salesReturnRouter = require("express").Router();
const handler = require("../controllers/salesReturn.controller");

salesReturnRouter.post("/", handler.createSalesReturn);
salesReturnRouter.get("/", handler.getAllSalesReturns);
salesReturnRouter.get("/get", handler.getSalesReturnById);

module.exports = salesReturnRouter;

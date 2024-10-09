const saleRouter = require("express").Router();
const handler = require("../controllers/sale.controller");

saleRouter.post("/", handler.createSale);
saleRouter.get("/", handler.getAllSales);
saleRouter.get("/sale", handler.getSaleById);

module.exports = saleRouter;

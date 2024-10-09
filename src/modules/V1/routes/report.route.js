const reportRouter = require("express").Router();
const handler = require("../controllers/report.controller");

reportRouter.get("/sales", handler.getSalesReport);
reportRouter.get("/products", handler.getProductPerformanceReport);
reportRouter.get("/customers", handler.getCustomerActivityReport);
reportRouter.get("/inventory", handler.getInventoryReport);
reportRouter.get("/sales-returns", handler.getSalesReturnReport);
reportRouter.get("/custom", handler.getCustomReport);
reportRouter.get("/export", handler.exportReport);

module.exports = reportRouter;

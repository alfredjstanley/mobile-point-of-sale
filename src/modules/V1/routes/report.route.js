const reportRouter = require("express").Router();

const verifyUser = require("../../../middlewares/auth.middleware");
const handler = require("../controllers/management/report.controller");

reportRouter.get("/bills", verifyUser, handler.getBillReport);
reportRouter.get("/credit-sales", verifyUser, handler.getCreditSalesReport);
reportRouter.get(
  "/sales/customer/:id",
  verifyUser,
  handler.getCustomerBillReport
);

module.exports = reportRouter;

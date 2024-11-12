const reportRouter = require("express").Router();

const verifyUser = require("../../../middlewares/auth.middleware");
const handler = require("../controllers/management/report.controller");

reportRouter.get("/bills", verifyUser, handler.getBillReport);

module.exports = reportRouter;

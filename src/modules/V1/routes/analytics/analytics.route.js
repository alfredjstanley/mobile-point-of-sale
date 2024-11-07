const router = require("express").Router();

const handler = require("../../controllers/analytics/analytics.controller");

const authMiddleware = require("../../../../middlewares/auth.middleware");

router.get("/sale-report", authMiddleware, handler.getSalesReport);
router.get("/top-selling-products", authMiddleware, handler.getTopSellingProductsReport);
module.exports = router;

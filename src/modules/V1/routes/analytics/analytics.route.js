const router = require("express").Router();

const handler = require("../../controllers/analytics/analytics.controller");

const authMiddleware = require("../../../../middlewares/auth.middleware");

/**
 * @route   GET /states
 * @desc    Get all states
 */
router.get("/sale-report", authMiddleware, handler.getSalesReport);

module.exports = router;

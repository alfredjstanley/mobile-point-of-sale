const router = require("express").Router();

const authMiddleware = require("../../../../middlewares/auth.middleware");
const handler = require("../../controllers/transaction/purchase.controller");

const {
  createPurchaseValidator,
} = require("../../validators/purchase.validator");
const handleValidationErrors = require("../../../../handlers/request.handler");

router.post(
  "/",
  authMiddleware,
  createPurchaseValidator,
  handleValidationErrors,
  handler.createPurchase
);

router.get("/", authMiddleware, handler.getPurchases);
router.get("/:id", authMiddleware, handler.getPurchaseById);

module.exports = router;

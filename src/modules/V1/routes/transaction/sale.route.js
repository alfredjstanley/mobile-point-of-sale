const router = require("express").Router();

const handler = require("../../controllers/transaction/sale.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");
const { createSaleValidator } = require("../../validators/sale.validator");
const handleValidationErrors = require("../../../../handlers/request.handler");

router.post(
  "/",
  authMiddleware,
  createSaleValidator,
  handleValidationErrors,
  handler.createSale
);

router.get("/", authMiddleware, handler.getSales);
router.get("/:id", authMiddleware, handler.getSaleById);

module.exports = router;

const router = require("express").Router();

const handler = require("../../controllers/management/saveOrder.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");
const reqestValidator = require("../../validators/saveOrder.validator");
const handleValidationErrors = require("../../../../handlers/request.handler");

router.post(
  "/",
  authMiddleware,
  reqestValidator.createSavedOrderValidator,
  handleValidationErrors,
  handler.createSavedOrder
);

router.get("/", authMiddleware, handler.getOrders);
router.get("/:id", authMiddleware, handler.getOrderById);
router.patch(
  "/:id",
  authMiddleware,
  reqestValidator.updateSavedOrderValidator,
  handleValidationErrors,
  handler.updateSavedOrder
);

module.exports = router;

const router = require("express").Router();

const handler = require("../../controllers/master/unit.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");
const { createUnitValidator } = require("../../validators/unit.validator");
const handleValidationErrors = require("../../../../handlers/request.handler");

router.post(
  "/",
  authMiddleware,
  createUnitValidator,
  handleValidationErrors,
  handler.createUnit
);

router.get("/", authMiddleware, handler.getUnits);
router.put("/:id", authMiddleware, handler.updateUnit);
router.get("/:id", authMiddleware, handler.getUnitById);
router.delete("/:id", authMiddleware, handler.deleteUnit);

module.exports = router;

const router = require("express").Router();

const handler = require("../controllers/category.controller");
const handleValidationErrors = require("../../../handlers/request.handler");
const authMiddleware = require("../../../middlewares/auth.middleware");
const { createCategoryValidator } = require("../validators/category.validator");

router.post(
  "/",
  authMiddleware,
  createCategoryValidator,
  handleValidationErrors,
  handler.createCategory
);

router.get("/", authMiddleware, handler.getCategories);
router.get("/:id", authMiddleware, handler.getCategoryById);
router.put("/:id", authMiddleware, handler.updateCategory);
router.delete("/:id", authMiddleware, handler.deleteCategory);

module.exports = router;

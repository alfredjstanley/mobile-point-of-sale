const router = require("express").Router();

const {
  createCategoryValidator,
} = require("../../validators/category.validator");
const { authMiddleware } = require("../../../../middlewares");
const handler = require("../../controllers/master/category.controller");
const handleValidationErrors = require("../../../../handlers").requestHandler;

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

const router = require("express").Router();

const {
  createProductValidator,
} = require("../../validators/product.validator");
const { authMiddleware } = require("../../../../middlewares");
const handler = require("../../controllers/master/product.controller");
const handleValidationErrors = require("../../../../handlers").requestHandler;

router.post(
  "/",
  authMiddleware,
  createProductValidator,
  handleValidationErrors,
  handler.createProduct
);

router.get("/", authMiddleware, handler.getProducts);
router.put("/:id", authMiddleware, handler.updateProduct);
router.get("/:id", authMiddleware, handler.getProductById);
router.delete("/:id", authMiddleware, handler.deleteProduct);
router.get("/category/:id", authMiddleware, handler.getProductsByCategory);

module.exports = router;

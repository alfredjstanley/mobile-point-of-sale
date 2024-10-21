const router = require("express").Router();

const handler = require("../controllers/master/product.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const handleValidationErrors = require("../../../handlers/request.handler");
const { createProductValidator } = require("../validators/product.validator");

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

module.exports = router;

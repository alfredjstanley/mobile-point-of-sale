const productRouter = require("express").Router();
const handler = require("../controllers/product.controller");

productRouter.post("/", handler.createProduct);
productRouter.get("/", handler.getAllProducts);

module.exports = productRouter;

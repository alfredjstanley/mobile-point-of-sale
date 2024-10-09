const router = require("express").Router();
const authRoute = require("./auth.route");
const productRoute = require("./product.route");
const categoryRouter = require("./category.route");
const customerRouter = require("./category.route");

router.use("/", authRoute);
router.use("/products", productRoute);
router.use("/categories", categoryRouter);
router.use("/customers", customerRouter);

module.exports = router;

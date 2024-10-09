const router = require("express").Router();

const authRoute = require("./auth.route");
const saleRouter = require("./sale.route");
const productRoute = require("./product.route");
const categoryRouter = require("./category.route");
const customerRouter = require("./customer.route");

router.use("/", authRoute);
router.use("/sales", saleRouter);
router.use("/products", productRoute);
router.use("/customers", customerRouter);
router.use("/categories", categoryRouter);

module.exports = router;

const router = require("express").Router();

const authRoute = require("./auth.route");
const saleRouter = require("./sale.route");
const reportRouter = require("./report.route");
const productRoute = require("./product.route");
const categoryRouter = require("./category.route");
const customerRouter = require("./customer.route");
const salesReturnRouter = require("./salesReturn.route");

router.use("/", authRoute);
router.use("/sales", saleRouter);
router.use("/reports", reportRouter);
router.use("/products", productRoute);
router.use("/customers", customerRouter);
router.use("/categories", categoryRouter);
router.use("/sales-returns", salesReturnRouter);

module.exports = router;

const router = require("express").Router();

const authRoute = require("./auth.route");
// const saleRouter = require("./sale.route");
// const storeRouter = require("./store.route");
// const reportRouter = require("./report.route");
// const productRoute = require("./product.route");
// const categoryRouter = require("./category.route");
// const customerRouter = require("./customer.route");
// const salesReturnRouter = require("./salesReturn.route");

const stateRouter = require("./resource/state.route");
// const districtRouter = require("./resource/district.route");

router.use("/", authRoute);
// router.use("/sales", saleRouter);
router.use("/states", stateRouter);
// router.use("/store", storeRouter);
// router.use("/reports", reportRouter);
// router.use("/products", productRoute);
// router.use("/customers", customerRouter);
// router.use("/districts", districtRouter);
// router.use("/categories", categoryRouter);
// router.use("/sales-returns", salesReturnRouter);

module.exports = router;

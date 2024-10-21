const router = require("express").Router();

const authRouter = require("./auth.route");
const unitRouter = require("./master/unit.route");
// const saleRouter = require("./sale.route");
const storeRouter = require("./store.route");
// const reportRouter = require("./report.route");
const productRoute = require("./product.route");
const categoryRouter = require("./category.route");
// const customerRouter = require("./customer.route");
// const salesReturnRouter = require("./salesReturn.route");

const stateRouter = require("./resource/state.route");
const districtRouter = require("./resource/district.route");

router.use("/", authRouter);
// router.use("/sales", saleRouter);
router.use("/states", stateRouter);
router.use("/store", storeRouter);
router.use("/units", unitRouter);
// router.use("/reports", reportRouter);
router.use("/products", productRoute);
// router.use("/customers", customerRouter);
router.use("/districts", districtRouter);
router.use("/categories", categoryRouter);
// router.use("/sales-returns", salesReturnRouter);

module.exports = router;

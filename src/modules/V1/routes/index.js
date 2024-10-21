const router = require("express").Router();

const authRouter = require("./auth.route");
const unitRouter = require("./master/unit.route");
const accountRouter = require("./master/account.route");

const saleRouter = require("./transaction/sale.route");
const storeRouter = require("./store.route");
const productRoute = require("./product.route");
const categoryRouter = require("./category.route");

const stateRouter = require("./resource/state.route");
const districtRouter = require("./resource/district.route");

// const reportRouter = require("./report.route");
// const salesReturnRouter = require("./salesReturn.route");

router.use("/", authRouter);
router.use("/sales", saleRouter);
router.use("/states", stateRouter);
router.use("/store", storeRouter);
router.use("/units", unitRouter);
router.use("/accounts", accountRouter);
router.use("/products", productRoute);
router.use("/districts", districtRouter);
router.use("/categories", categoryRouter);

// router.use("/reports", reportRouter);
// router.use("/sales-returns", salesReturnRouter);

module.exports = router;

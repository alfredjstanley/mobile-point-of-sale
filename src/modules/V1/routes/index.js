const router = require("express").Router();

const authRouter = require("./core/auth.route");
const unitRouter = require("./master/unit.route");
const accountRouter = require("./master/account.route");

const storeRouter = require("./core/store.route");
const saleRouter = require("./transaction/sale.route");
const productRoute = require("./master/product.route");
const categoryRouter = require("./master/category.route");

const taxRouter = require("./resource/tax.route");
const stateRouter = require("./resource/state.route");
const districtRouter = require("./resource/district.route");

// const reportRouter = require("./report.route");
// const salesReturnRouter = require("./salesReturn.route");

router.use("/", authRouter);

router.use("/units", unitRouter);
router.use("/sales", saleRouter);
router.use("/store", storeRouter);

router.use("/products", productRoute);
router.use("/accounts", accountRouter);
router.use("/categories", categoryRouter);

router.use("/taxes", taxRouter);
router.use("/states", stateRouter);
router.use("/districts", districtRouter);

// router.use("/reports", reportRouter);
// router.use("/sales-returns", salesReturnRouter);

module.exports = router;

const router = require("express").Router();

const authRouter = require("./core/auth.route");
const unitRouter = require("./master/unit.route");
const accountRouter = require("./master/account.route");

const reportRouter = require("./report.route");
const storeRouter = require("./core/store.route");
const saleRouter = require("./transaction/sale.route");
const productRoute = require("./master/product.route");
const categoryRouter = require("./master/category.route");
const purchaseRouter = require("./transaction/purchase.route");

const taxRouter = require("./resource/tax.route");
const stateRouter = require("./resource/state.route");
const districtRouter = require("./resource/district.route");
const storeTypeRouter = require("./resource/storeType.route");

const paymentRouter = require("./transaction/payment.route");
const analyticsRouter = require("./analytics/analytics.route");
const saveOrderRouter = require("./management/saveOrder.route");

router.use("/", authRouter);

router.use("/units", unitRouter);
router.use("/sales", saleRouter);
router.use("/store", storeRouter);

router.use("/reports", reportRouter);
router.use("/products", productRoute);
router.use("/accounts", accountRouter);
router.use("/payments", paymentRouter);

router.use("/purchases", purchaseRouter);
router.use("/categories", categoryRouter);

router.use("/taxes", taxRouter);
router.use("/states", stateRouter);
router.use("/districts", districtRouter);
router.use("/analytics", analyticsRouter);
router.use("/store-types", storeTypeRouter);

router.use("/saves/orders", saveOrderRouter);

module.exports = router;

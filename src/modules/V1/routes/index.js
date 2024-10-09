const router = require("express").Router();
const authRoute = require("./auth.route");
const productRoute = require("./product.route");

router.use("/", authRoute);
router.use("/products", productRoute);

module.exports = router;

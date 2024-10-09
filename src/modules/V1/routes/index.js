const router = require("express").Router();
const authRoute = require("./auth.route");

router.use("/", authRoute);

module.exports = router;

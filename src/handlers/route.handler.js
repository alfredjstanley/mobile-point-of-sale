const router = require("express").Router();
const v1Routes = require("../modules/V1/routes");

function indexRoute(_, res) {
  return res
    .status(200)
    .send("Welcome to MPOS API Server — where transactions come to life! 🌟");
}

router.get("/", indexRoute);
router.use("/v1", v1Routes);

module.exports = router;

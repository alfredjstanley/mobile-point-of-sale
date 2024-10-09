const router = require("express").Router();
const v1Routes = require("../modules/V1/routes");
const MESSAGES = require("../utils/messages.util");

const indexRoute = (_, res) => res.status(200).send(MESSAGES.WELCOME_MESSAGE);

router.get("/", indexRoute);
router.use("/v1", v1Routes);

module.exports = router;

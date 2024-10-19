const express = require("express");
const router = express.Router();

const handler = require("../controllers/store.controller");
const verifyUser = require("../../../middlewares/auth.middleware");

router.get("/", verifyUser, handler.getStoreDetails);
router.delete("/", verifyUser, handler.deleteStore);
router.put("/", verifyUser, handler.updateStore);

module.exports = router;

const express = require("express");
const router = express.Router();

const handler = require("../controllers/store.controller");

router.post("/", handler.createStore);
router.get("/", handler.getAllStores);
router.get("/:id", handler.getStoreById);
router.put("/:id", handler.updateStore);
router.delete("/:id", handler.deleteStore);

module.exports = router;

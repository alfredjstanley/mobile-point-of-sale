const express = require("express");
const router = express.Router();

const handler = require("../../controllers/resource/storeType.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.get("/", authMiddleware, handler.getAllStoreTypes);
router.get("/:id", authMiddleware, handler.getStoreTypeById);
router.post("/", authMiddleware, handler.createStoreType);
router.put("/:id", authMiddleware, handler.updateStoreType);
router.delete("/:id", authMiddleware, handler.deleteStoreType);

module.exports = router;

const router = require("express").Router();

const { authMiddleware } = require("../../../../middlewares");
const handler = require("../../controllers/core/store.controller");

router.get("/", authMiddleware, handler.getStoreDetails);
router.delete("/", authMiddleware, handler.deleteStore);
router.put("/", authMiddleware, handler.updateStore);

module.exports = router;

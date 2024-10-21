const router = require("express").Router();

const handler = require("../../controllers/master/account.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");
const {
  createAccountValidator,
} = require("../../validators/account.validator");
const handleValidationErrors = require("../../../../handlers/request.handler");

router.post(
  "/",
  authMiddleware,
  createAccountValidator,
  handleValidationErrors,
  handler.createAccount
);

router.get("/", authMiddleware, handler.getAccounts);

module.exports = router;

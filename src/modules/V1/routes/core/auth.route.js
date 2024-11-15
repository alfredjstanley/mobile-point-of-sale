const authRouter = require("express").Router();

const validator = require("../../validators/auth.validator");

const { authMiddleware } = require("../../../../middlewares");
const handler = require("../../controllers/core/auth.controller");
const handleValidationErrors = require("../../../../handlers").requestHandler;

authRouter.get(
  "/verify/:phoneNumber",
  validator.verifyUserValidator,
  handleValidationErrors,
  handler.verifyUser
);

authRouter.post(
  "/register",
  validator.registerValidator,
  handleValidationErrors,
  handler.register
);
authRouter.post(
  "/reset",
  validator.resetMpinValidator,
  handleValidationErrors,
  handler.resetMpin
);

authRouter.post(
  "/",
  validator.loginValidator,
  handleValidationErrors,
  handler.signIn
);

authRouter.post(
  "/add",
  authMiddleware,
  validator.addStaffValidator,
  handleValidationErrors,
  handler.addStaff
);

authRouter.get(
  "/staff/:id",
  authMiddleware,
  validator.getStaffByIdValidator,
  handleValidationErrors,
  handler.getStaffById
);

authRouter.put(
  "/staff/:id",
  authMiddleware,
  validator.updateStaffValidator,
  handleValidationErrors,
  handler.updateStaff
);

authRouter.get("/staffs", authMiddleware, handler.getStaffs);

module.exports = authRouter;

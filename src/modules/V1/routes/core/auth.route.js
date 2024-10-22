const authRouter = require("express").Router();
const { authMiddleware } = require("../../../../middlewares");
const handler = require("../../controllers/core/auth.controller");

authRouter.get("/verify/:phoneNumber", handler.verifyUser);
authRouter.post("/register", handler.register);
authRouter.post("/reset", handler.resetMpin);
authRouter.post("/", handler.signIn);

authRouter.get("/staff/:id", handler.getStaffById);
authRouter.post("/add", authMiddleware, handler.addStaff);
authRouter.get("/staffs", authMiddleware, handler.getStaffs);

module.exports = authRouter;

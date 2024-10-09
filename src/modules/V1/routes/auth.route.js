const authRouter = require("express").Router();
const handler = require("../controllers/auth.controller");

authRouter.post("/", handler.signUp);
authRouter.post("/login", handler.login);

module.exports = authRouter;

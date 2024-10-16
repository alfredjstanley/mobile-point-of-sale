const authRouter = require("express").Router();
const handler = require("../controllers/auth.controller");

authRouter.post("/register", handler.register);
authRouter.post("/reset", handler.resetMpin);
authRouter.post("/", handler.signIn);

authRouter.get("/", handler.getUser);
authRouter.post("/add", handler.addUser);
authRouter.get("/users", handler.getUsers);

module.exports = authRouter;

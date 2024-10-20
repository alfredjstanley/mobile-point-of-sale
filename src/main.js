const app = require("express")();

const appRoutes = require("./handlers/route.handler");
const appWares = require("./middlewares/app.middleware");
const errorHandler = require("./handlers/error.handler");

// Init application middlewares.
appWares(app);

// Route handlers.
app.use("/api", appRoutes);

// Global error handler.
errorHandler(app);

module.exports = app;

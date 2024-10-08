const app = require("express")();

const appWares = require("./middlewares/app.middleware");
const errorHandler = require("./utils/errorHandler.utils");
const appRoutes = require("./routes");

// Init application middlewares.
appWares(app);

// Route handlers.
app.use("/api/", appRoutes);

// Global error handler.
errorHandler(app);

module.exports = app;

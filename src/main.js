const app = require("express")();

const appRoutes = require("./handlers/route.handler");
const appWares = require("./middlewares/app.middleware");
const errorHandler = require("./handlers/error.handler");
const qrRoute = require("./modules/V1/routes/resource/qr.route");

// Init application middlewares.
appWares(app);

// Route handlers.
app.use("/api", appRoutes);
app.use("/qr", qrRoute);

// Global error handler.
errorHandler(app);

module.exports = app;

module.exports = (app) => {
  app.use((err, req, res, next) => {
    console.error("ERROR", err.stack);
    res.status(500).send("Something went wrong!");
  });
};

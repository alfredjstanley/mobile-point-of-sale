module.exports = (app) => {
  app.use((err, req, res, next) => {
    if (err.name === "ValidationError")
      return res.status(400).json({ success: false, error: err.message });

    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyValue)[0];
      const message = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`;
      return res.status(409).json({ success: false, error: message });
    }

    if (err.message) {
      // send custom success failure response; {required for error handling for mobile team {stupidity}}
      return res.status(200).json({ success: false, error: err.message });
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  });
};

const mongoose = require("mongoose");

const qrLogSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    userAgent: String,
    deviceType: String,
    ipAddress: String,
    referrer: String,
    language: String,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("QrLog", qrLogSchema);

const express = require("express");
const router = express.Router();
const useragent = require("express-useragent");

const QrLog = require("../../models/others/qrLog.model");

router.use(useragent.express());

const url = {
  android: "https://play.google.com/store/apps/details?id=com.wac.olopouser",
  ios: "https://apps.apple.com/in/app/olopo/id6651817861",
  web: "https://olopo.app",
};

router.get("/", async (req, res) => {
  try {
    let deviceType = "Other";
    if (req.useragent.isAndroid) {
      deviceType = "Android";
    } else if (
      req.useragent.isiPhone ||
      req.useragent.isiPad ||
      req.useragent.isiPod
    ) {
      deviceType = "iOS";
    }

    // Collect data for logging
    const logData = {
      userAgent: req.headers["user-agent"],
      deviceType: deviceType,
      ipAddress: req.ip || req.connection.remoteAddress,
      referrer: req.get("Referrer") || "Direct",
      language: req.get("Accept-Language"),
    };

    // Create and save the log entry
    const logEntry = new QrLog(logData);
    await logEntry.save();

    switch (deviceType) {
      case "Android":
        res.redirect(302, url.android);
        break;
      case "iOS":
        res.redirect(302, url.ios);
        break;

      default:
        res.redirect(302, url.web);
        break;
    }
  } catch (error) {
    console.error("Redirection error:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

module.exports = router;

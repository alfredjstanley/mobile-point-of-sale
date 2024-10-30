const express = require("express");
const router = express.Router();
const useragent = require("express-useragent");

router.use(useragent.express());

const androidStoreUrl =
  "https://play.google.com/store/apps/details?id=com.wac.olopouser";
const iosStoreUrl = "https://apps.apple.com/in/app/olopo/id6651817861";

router.get("/", (req, res) => {
  try {
    if (req.useragent.isAndroid) {
      res.redirect(302, androidStoreUrl);
    } else if (
      req.useragent.isiPhone ||
      req.useragent.isiPad ||
      req.useragent.isiPod
    ) {
      res.redirect(302, iosStoreUrl);
    } else {
      res.redirect(302, "https://olopo.app/");
    }
  } catch (error) {
    console.error("Redirection error:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

module.exports = router;

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes.
const RATE_LIMIT_MAX_REQUESTS = 250; // Maximum number of requests per window.

const limiterConfig = rateLimiter({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: "Apparently, you're requesting too much. please try again later.",
  },
  headers: false, // Disable X-RateLimit headers
});

module.exports = (app) => {
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(limiterConfig);
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: false }));
};

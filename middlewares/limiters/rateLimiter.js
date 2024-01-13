const express = require("express");
const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
  max: 5,
  windowMs: 10000,
  message: "Can't Make Any requests at the moment, please try again later",
});

module.exports = limiter;

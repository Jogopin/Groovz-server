const rateLimit = require("express-rate-limit");
const ErrorHandler = require("../error-handling/ErrorHandler");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: new ErrorHandler(429,"Too many requests from this IP, please try again after 15 minutes")
});

module.exports={limiter}

const ErrorHandler = require("./ErrorHandler");
const ERROR_CODES = {
  INVALID_TOKEN: "invalid_token",
  CREDENTIALS_REQUIRED: "credentials_required",
  DUPLICATED_KEY: 11000
};

function logError(req, error) {
  console.error("ERROR", req.method, req.path, error);
}

function handleInvalidTokenError(req, res) {
  logError(req, "Unauthorized");
  return res.status(401).json({ message: "Unauthorized token" });
}

function handleCredentialsRequiredError(req, res) {
  logError(req, "Missing credentials");
  return res.status(401).json({ message: "Missing credentials" });
}

function handleDuplicatedKeyError(err, res) {
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  return res.status(422).json({message:`The "${key}" "${value}" is already used`});
}

module.exports = (app) => {
  // this middleware runs whenever requested page is not available
  app.use((req, res, next) => {
    res.status(404).json({ message: "This route does not exist" });
  });

  // whenever you call next(err), this middleware will handle the error
  app.use((err, req, res, next) => {
    
    switch(err.code) {
      case ERROR_CODES.INVALID_TOKEN:
        return handleInvalidTokenError(req, res);
      case ERROR_CODES.CREDENTIALS_REQUIRED:
        return handleCredentialsRequiredError(req, res);
      case ERROR_CODES.DUPLICATED_KEY:
        return handleDuplicatedKeyError(err, res);
      default:
        if (err instanceof ErrorHandler) {
          logError(req, err.message);
          return res.status(err.statusCode).json({ message: err.message });
        }
        logError(req, err);
        //if the error ocurred before sending the response
        if (!res.headersSent) {
          return res.status(500).json({
            message: "Internal server error. please try again later",
          });
        }
    }
  });
};


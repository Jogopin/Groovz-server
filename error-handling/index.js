const ErrorHandler = require("./ErrorHandler");

module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    if(err.code === "invalid_token") {
      console.log("Unauthorized",req.method,req.path)
      
      return res.status(401).json({ message: 'Unauthorized token' });
      
    } else if (err instanceof ErrorHandler) { 
      console.error("ERROR", req.method, req.path, err.message);
      return res.status(err.statusCode).json({ message: err.message }); // return status code and message from ErrorHandler
    }


    console.error("ERROR", req.method, req.path, err);
    

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal server error. please try again later",
      });
    }
  });
};

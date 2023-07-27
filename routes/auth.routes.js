const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const ErrorHandler = require("../error-handling/ErrorHandler");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password, username } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || username === "") {
    return next(new ErrorHandler(400,"Provide email, password and name"))
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler(400,"Provide a valid email address."))
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return next(new ErrorHandler(400,"Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter."))
    
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({$or:[{email:email},{username:username}]})
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        throw new ErrorHandler(400,"Email or username already exists.")
      }
      
      
      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword, username });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      
      const { email, username, _id } = createdUser;
      // Create a new object that doesn't expose the password
      const user = { email, username, _id };

      
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); 
});

// POST  /auth/login - Verifies username and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  // Check if username or password are provided as empty string
  if (username === "" || password === "") {
    return next(new ErrorHandler(400,"Provide email and password."))
   
  }

  // Check the users collection if a user with the same username exists
  User.findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found
        throw new ErrorHandler(401,"User not found.") 
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, username } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, username };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {

        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

// GET /auth/user/:id  - Used to get details of an user
router.get("/user/:id", isAuthenticated, (req, res, next) => {
  const authenticatedUser = req.payload;
  const requestedUserId = req.params.id;

  if (authenticatedUser._id !== requestedUserId) {
    return next(new ErrorHandler(403,`${req.payload.username} does not have authorization to get this data`))
  }

  User.findById(requestedUserId)
    .then(response => {
      const {firstName,lastName,address,email,username,createdAt} = response
      res.json({firstName,lastName,address,email,username,createdAt});
    })
    .catch((error) => {
      console.error("Error getting userDetails");
      next(error)
    });
});

router.put("/user/:id",isAuthenticated,(req,res,next)=>{
  const authenticatedUser = req.payload;
  const requestedUserId = req.params.id;
  const {firstName,lastName,address} = req.body
  
  if (authenticatedUser._id !== requestedUserId) {
    return next(new ErrorHandler(403,`${req.payload.username} does not have authorization to update this data`))
  }
  User.findByIdAndUpdate(requestedUserId,{firstName,lastName,address},{new:true})
    .then(updatedUser=>{
      res.status(200).json(updatedUser);
    })
    .catch(error=>{
      console.error("Error updating the user details")
      next(error)
    })
})
module.exports = router;

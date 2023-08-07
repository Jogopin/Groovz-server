const express = require("express");
const router = express.Router();
const nodemailer = require ("nodemailer");
const { limiter } = require("../middleware/limiter.middleware");
router.get("/", (req, res, next) => {
  res.json("All good in here");
});
router.post("/contact",limiter, (req, res, next) => {
  let {email,subject,message} = req.body

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_EMAIL_PASSWORD 
    }
  });

  transporter.sendMail({
    from: email, //This is being overridden by Gmail to CONTACT_EMAIL
    to: process.env.CONTACT_EMAIL,
    subject,
    text: `From: ${email}\n\n${message}`,
    html: `<p>From: ${email}</p><b>${message}</b>`

  }).then((response)=>{
    
    res.json("email sent correctly")
  }).catch((error)=>{
    next(error)
  })
  
});

module.exports = router;

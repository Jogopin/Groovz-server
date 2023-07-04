const express = require("express")
const router = express.Router()
const Review = require("../models/Review.model")

//POST: create a new Review in the DB
router.post("/reviews",(req,res,next)=>{

    const { product,user,rating,reviewText} = req.body
  
    const reviewData = { product,user,rating,reviewText}
    
    Review.create(reviewData)
        .then(newReview=>{
            res.json(newReview)
        })
        .catch(error=>{
            
            console.log("something happened creating a review",error)
            res.status(500).json(error)
        })
})

module.exports =router
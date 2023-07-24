const express = require("express")
const router = express.Router()
const Review = require("../models/Review.model")
const { isAuthenticated } = require("../middleware/jwt.middleware")

//POST: create a new Review in the DB
router.post("/reviews",isAuthenticated,(req,res,next)=>{

    const user = req.payload._id
    const { product,rating,reviewText} = req.body
  
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

//GET: to get all reviews for a specific product
router.get("/reviews/:productId",(req,res,next)=>{

    const { productId } = req.params
    
    // Use the Review model to find all reviews that match the given productId
    Review.find({product:productId})
        .populate({path: "user",select:"username"}) // Populate the 'user' field in the found reviews
        .then(reviewList=>{
            res.json(reviewList)
        })
        .catch(error=>{
            
            console.log(`something happened getting a list of reviews for "${productId}"`,error)
            res.status(500).json(error)
        })

})

module.exports =router
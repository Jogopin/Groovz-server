const express = require("express")
const Order = require("../models/Order.model")
const { isAuthenticated } = require("../middleware/jwt.middleware")
const ErrorHandler = require("../error-handling/ErrorHandler")
const router = express.Router()
//GET: Order from user
router.get("/orders/:id",isAuthenticated,(req,res,next)=>{
    const userId = req.params.id
    const authenticatedUserId = req.payload._id
    
    if(userId!==authenticatedUserId){
        return next(new ErrorHandler(401,`you dont have authorization to check this orders`))
    }
    Order.find({user:userId}).populate({path:"products.product",select:"images name reference"})
        .then(ordersList=>{
            res.json(ordersList)
            
        })
        .catch(error=>{
            next(error)
        })
})

module.exports = router
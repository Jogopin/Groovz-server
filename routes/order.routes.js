const express = require("express")
const Order = require("../models/Order.model")
const { isAuthenticated } = require("../middleware/jwt.middleware")
const router = express.Router()
//GET: Order from user
router.get("/orders/:id",isAuthenticated,(req,res,next)=>{
    const userId = req.params.id
    const authenticatedUserId = req.payload._id
    
    if(userId!==authenticatedUserId){
        res.status(401).json({message:"you dont have authorization for this "})
        return
    }
    Order.find({user:userId}).populate({path:"products.product",select:"images name reference"})
        .then(ordersList=>{
            res.json(ordersList)
            
        })
        .catch(error=>{
            console.log(error)
        })
})

module.exports = router
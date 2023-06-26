const express =require("express");
const router = express.Router()
const Product =  require("../models/Product.model")

//POST: create a product in the DB

router.post("/products",(req,res,next)=>{


    const {name, reference,price,discount,description,stock} = req.body
    const productData= {name, reference,price,discount,description,stock}

    Product.create(productData)
        .then(responseProduct=>{
            res.json(responseProduct)
        })
        .catch(error=>{
            
            console.log("something happened creating a Product",error)
            res.status(500).json(error)
        })


    
})

module.exports = router


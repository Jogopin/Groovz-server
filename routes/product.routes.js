const express =require("express");
const router = express.Router()
const Product =  require("../models/Product.model")

//POST: create a product in the DB
router.post("/products",(req,res,next)=>{

    const {name, reference,price,discount,description,category,stock} = req.body
    const productData= {name, reference,price,discount,description,category,stock}

    Product.create(productData)
        .then(responseProduct=>{
            res.json(responseProduct)
        })
        .catch(error=>{
            
            console.log("something happened creating a Product",error)
            res.status(500).json(error)
        })
    
})
//GET: All the products
router.get("/products",(req,res,next)=>{

})

module.exports = router


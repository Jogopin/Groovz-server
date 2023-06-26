const express =require("express");
const router = express.Router()
const Product =  require("../models/Product.model")

//POST: create a product in the DB
router.post("/products",(req,res,next)=>{

    const {name, reference,price,discount,description,category,stock} = req.body
    const productData= {name, reference,price,discount,description,category,stock}

    Product.create(productData)
        .then(newProduct=>{
            res.json(newProduct)
        })
        .catch(error=>{
            
            console.log("something happened creating a Product",error)
            res.status(500).json(error)
        })
    
})
//GET: All the products
router.get("/products",(req,res,next)=>{

    Product.find()
        .then(productsList=>{
            res.json(productsList)
        })
        .catch(error=>{
            
            console.log("something happened getting the productsList",error)
            res.status(500).json(error)
        })
})

//GET: a product by ID
router.get("/products/:id",(req,res,next)=>{
    
    const productId = req.params.id

    Product.findById(productId)
        .then(product=>{
            res.json(product)
        })
        .catch(error=>{
            
            console.log(`something happened getting the product ${productId}`,error)
            res.status(500).json(error)
        })
})



module.exports = router


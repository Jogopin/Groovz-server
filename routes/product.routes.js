const express =require("express");
const router = express.Router()
const Product =  require("../models/Product.model")

// ***** require fileUploader in order to use it *****
const fileUploader = require("../config/cloudinary.config")

//POST: create a product in the DB
router.post("/products",(req,res,next)=>{

    const {name, reference,price,discount,description,category,stock,images} = req.body
    const productData= {name, reference,price,discount,description,category,stock,images}

    Product.create(productData)
        .then(newProduct=>{
            res.json(newProduct)
        })
        .catch(error=>{
            
            //code 11000 duplicated key error
            if(error.code === 11000){ 

                const key = Object.keys(error.keyValue)[0]; // Get the key of the duplicate field
                const value = error.keyValue[key]; // Get the value of the duplicate field

                console.log(`The "${key}" "${value}" is already used`)
                res.status(400).json({ message: `The "${key}" "${value}" is already used`});
            }else{
                console.log("something happened creating a Product",error)
                res.status(500).json(error)

            }
        })
    
})
//POST: Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload",fileUploader.single("imageUrl"),(req,res,next)=>{

    // console.log("file is: ", req.file)

    if(!req.file){
        next(new Error("No file uploaded!"))
        return
    }

    res.json({fileUrl:req.file.path})
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


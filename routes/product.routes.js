const express =require("express");
const router = express.Router()
const Product =  require("../models/Product.model")
const User = require("../models/User.model");
const ErrorHandler = require("../error-handling/ErrorHandler");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// ***** require fileUploader in order to use it *****
const fileUploader = require("../config/cloudinary.config");

//POST: create a product in the DB
router.post("/products",isAuthenticated,(req,res,next)=>{
    const userId = req.payload._id
    const {name, reference,price,discount,description,category,stock,images} = req.body
    const productData= {name, reference,price,discount,description,category,stock,images}
    
    User.findById(userId)
        .then(userData=>{
            if(!userData.isAdmin){
                throw new ErrorHandler(403,`${userData.username} does not have authorization to add a product`)
            }
            return Product.create(productData)
        })   
        .then(newProduct=>{
            res.json(newProduct)
        })
        .catch(error=>{        
            next(error)
        })
    
})
//POST: Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload",fileUploader.single("imageUrl"),(req,res,next)=>{

    // console.log("file is: ", req.file)

    if(!req.file){
        next(new ErrorHandler(400,"No file uploaded!"))
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
            next(error);
        });
})

//GET: a product by ID
router.get("/products/:id",(req,res,next)=>{
    
    const productId = req.params.id

    Product.findById(productId)
        .then(product=>{
            if (!product) {
                throw new ErrorHandler(404, `Product with id: ${productId} not found`);
                
            }
            res.json(product)
        })
        .catch(error=>{
            
            console.log(`something happened getting the product ${productId}`)
            next(error)
        })
})



module.exports = router


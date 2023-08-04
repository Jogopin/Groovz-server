const { Schema, model, default:mongoose } = require("mongoose")

const productSchema = new Schema(
    {
        name: {
            type:String,
            required:[true, "name is required"],
            trim:true
        },
        reference:{
            type:String,
            required:[true,"reference is required"],
            trim:true,
            unique:true,
        },
        images:[String],
        description:{
            type:String,
            required:[true, "description is required"],
            trim:true
        },
        category:{
            type:String,
            enum:["headphones","speakers"],
            required:true,
        },
        price:{
            type:Number,
            required:[true, "price is required"],
        },
        discount:{
            type:Number,
            default:0,
        },
        stock:{
            type:Number,
            required:[true,"stock is required"]
        },
        isHeroProduct:{
            type:Boolean,
            default:false
        },
        isFavorite:{
            type:Boolean,
            default:false
        }


        
    },
    {
        timestamps:true
    }
)
const Product = model("Product", productSchema)

module.exports=Product
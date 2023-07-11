const express = require("express")
const Product = require("../models/Product.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/checkout", (req, res, next) => {
    const { productsToCheckout } = req.body;

    // Respond early if no products were supplied in the request
    if (productsToCheckout.length ===0){
      res.status(400).json({message:"No items in the cart"})
      return
    }

    // Extract the references from the client request
    const referencesArray = productsToCheckout.map((prod) => prod.reference);

    // Retrieve actual product details from database using references to prevent client-side manipulation of data
    Product.find({ reference: { $in: referencesArray } })
      .then((productList) => {
        
        // Initialize an array to keep track of out-of-stock products
        let outOfStockProducts = [];

        // Map each product in the productList to the line_items format required by Stripe
        const line_items = productList.map((prod) => {
          const { quantity } = productsToCheckout.find(
            (item) => prod.reference === item.reference
          );
          
          if(prod.stock<quantity){
            outOfStockProducts.push(prod.name)
            return null
          }
          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: prod.name,
                images: [prod.images[0]],
              },
              unit_amount: prod.price * 100,  // Stripe requires the price to be in the smallest currency unit (i.e., cents)
            },
            quantity,
          };
        });

        // If there are out-of-stock products, send a response back to the client and return early
        if(outOfStockProducts.length>0){
          res.status(400).json({message:"The following products are out of stock: " + outOfStockProducts.join(", ")})
          return
        }
        // Create Stripe Checkout session with the constructed line items
        return stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items,
          success_url: `${process.env.ORIGIN}/success`,
          cancel_url: `${process.env.ORIGIN}/cancel`,
        });
      })
      .then((session) => {
        res.json(session.url);
      })
      .catch(error=>{
              
        console.log(`An error occurred during the checkout process`,error)
        res.status(500).json({message:"An error occured while processing your request. Please try again later"})
    })
  
   
  });
  
  module.exports = router
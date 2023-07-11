const express = require("express")
const Product = require("../models/Product.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/checkout", (req, res, next) => {
    const { productsToCheckout } = req.body;
    if (productsToCheckout.length ===0){
      res.status(400).json("0 items in the cart")
      return
    }
    const referencesArray = productsToCheckout.map((prod) => prod.reference);
  
    Product.find({ reference: { $in: referencesArray } })
      .then((productList) => {
  
        const line_items = productList.map((prod) => {
          const { quantity } = productsToCheckout.find(
            (item) => prod.reference === item.reference
          );
  
          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: prod.name,
                images: [prod.images[0]],
              },
              unit_amount: prod.price * 100,
            },
            quantity,
          };
        });
  
        return stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items,
          success_url: `${process.env.ORIGIN}/success`,
          cancel_url: `${process.env.ORIGIN}/cancel`,
        });
      })
      .then((response) => {
        console.log(response.url);
        res.json(response.url);
      })
      .catch(error=>{
              
        console.log(`something happened!!`,error)
        res.status(500).json(error)
    })
  
   
  });
  
  module.exports = router
const express = require("express");
const Product = require("../models/Product.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const {
  formatLineItems,
  checkStockAndFormatOrder,
} = require("../utils/checkoutHelpers");
const Order = require("../models/Order.model");
const router = express.Router();

router.post("/checkout", async (req, res, next) => {
  try {
    const { productsToCheckout,customerData } = req.body;
    const userId = customerData.userId ? customerData.userId : null;

    // Respond early if no products were supplied in the request
    if (productsToCheckout.length === 0) {
      return res.status(400).json({ message: "No items in the cart" });
      
    }

    // Extract the references from the client request
    const referencesArray = productsToCheckout.map((prod) => prod.reference);

    // Retrieve actual product details from database using references to prevent client-side manipulation of data
    const productsList = await Product.find({
      reference: { $in: referencesArray },
    });
    const productsForOrder = checkStockAndFormatOrder(
      productsList,
      productsToCheckout
    );
    // create line_items format required by Stripe
    const lineItems = formatLineItems(productsList, productsToCheckout);
    // Create Stripe Checkout session with the constructed line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.ORIGIN}/success`,
      cancel_url: `${process.env.ORIGIN}/cancel`,
      // metadata: {
      //   user_data: "probando uno dos tres",
      //   product_data: JSON.stringify(productsToCheckout),
      // },
    });
    // Construct order data
    const orderData = {
      user: userId,
      products: productsForOrder,
      total: session.amount_total/100,
      stripeSessionId: session.id,
      address: customerData.address,
      name: customerData.name,
      lastName: customerData.lastName,
      email: customerData.email,
    };
    const newOrder = await Order.create(orderData);
    console.log(newOrder)
    res.json(session.url);
    
  } catch (error) {
    if (error.message) {
      console.log(`An error occurred during the checkout process`, error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.log(`An error occurred during the checkout process`, error);
      res.status(500).json({
        message:
          "An error occured while processing your request. Please try again later",
      });
    }
  }
});

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;
    let event;

    // Construct the event from the raw request body and verify the signature
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log("Webhook Error: ", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    //Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("--------------------------------");
        const totalPaid = event.data.object.amount_total / 100;
        console.log(totalPaid)
        // const metadata = event.data.object.metadata;
        // console.log("metadata", metadata);
        // const productData = JSON.parse(metadata.product_data);
        // console.log("product_data", productData);
        console.log("stripePaimentId")
        console.log("checkout session completed!!!!");
        break;
      case "checkout.session.expired":
        console.log("checkout session expired!!!!!");
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

module.exports = router;

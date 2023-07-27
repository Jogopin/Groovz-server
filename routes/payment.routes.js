const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const { STATUS } = require("../constants");
const {
  formatLineItems,
  checkStockAndFormatOrder,
} = require("../utils/checkoutHelpers");
const ErrorHandler = require("../error-handling/ErrorHandler");

router.post("/checkout", async (req, res, next) => {
  try {
    const { productsToCheckout, customerData } = req.body;
    const userId = customerData.userId ? customerData.userId : null;

    // Respond early if no products were supplied in the request
    if (productsToCheckout.length === 0) {
      throw new ErrorHandler(400,"no items in the cart")
    }

    const newCustomerStripe = await stripe.customers.create({
      email: customerData.email,
    });

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
    // Create line_items format required by Stripe
    const lineItems = formatLineItems(productsList, productsToCheckout);
    // Create Stripe Checkout session with the constructed line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.ORIGIN}/success`,
      cancel_url: `${process.env.ORIGIN}/checkout`,
      customer: newCustomerStripe.id,
      // metadata: {
      //   product_data: JSON.stringify(productsToCheckout),
      // },
    });
    // Construct order data
    const orderData = {
      user: userId,
      products: productsForOrder,
      total: session.amount_total / 100,
      stripeSessionId: session.id,
      address: customerData.address,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
    };

    await Order.create(orderData);

    res.json(session.url);
  } catch (error) {

      next(error)
  }
});

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res, next) => {
    try {
      const sig = req.headers["stripe-signature"];
      const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;
      // Construct the event from the raw request body and verify the signature
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      const stripeSessionId = event.data.object.id 
      //Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          const stripePaymentId = event.data.object.payment_intent;
          // Update the Order 
          const orderUpdated = await Order.findOneAndUpdate(
            { stripeSessionId: event.data.object.id },
            { stripePaymentId, status: STATUS.PAID },
            { new: true }
          );
          if(!orderUpdated){           
            return next(new ErrorHandler(404,"No matching order found for the provided stripeSessionId"));
          }
          //update the Stock in the DB
          const updateStockPromises = orderUpdated.products.map(item=>{
            return Product.findByIdAndUpdate(item.product.toString(),{$inc:{stock:-item.quantity}})
          })
          await Promise.all(updateStockPromises)

          console.log("checkout session completed!");
          break;

        case "checkout.session.expired":

            const orderDeleted = await Order.findOneAndDelete({ stripeSessionId: event.data.object.id })
            
            if(orderDeleted){
                console.log(`checkout session expired => order: ${orderDeleted.id} deleted`);
            } else {
                console.log(`checkout session expired => No order found with the provided stripeSessionId: ${stripeSessionId}`);
            }
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      res.json({ received: true });
    } catch (error) {
      next(error)
      
    }
  }
);

module.exports = router;

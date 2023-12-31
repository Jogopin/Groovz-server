const { Schema, model } = require("mongoose");
const { STATUS } = require("../constants");

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    stripePaymentId:{
        type:String,
    },
    status: {
      type: String,
      enum: [STATUS.PENDING, STATUS.PAID, STATUS.SHIPPED, STATUS.DELIVERED],
      default: STATUS.PENDING,
    },
    // Storing the customer's information at the time of the order
    // This is important for maintaining historical accuracy, improving performance,
    // and enabling guest checkouts.
    address: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

module.exports = Order;

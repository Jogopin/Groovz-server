const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    reviewText: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);
//  A user can only write one review for each product.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = model("Review", reviewSchema);

module.exports = Review;

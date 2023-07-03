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
        review: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
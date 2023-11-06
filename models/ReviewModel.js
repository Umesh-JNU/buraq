const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required."],
      ref: "User",
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Driver is not provided."],
      ref: "User",
    },
    rating: {
      type: Number,
      required: [true, "Please rate the product."],
      max: 5,
    },
    compliment: {
      type: String,
      required: [true, "Please provide a compliment."],
    },
    comment: {
      type: String,
      required: [true, "Please write a comment."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bankSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    accountNum: {
      type: Number,
      required: true,
      unique: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    post_code: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);

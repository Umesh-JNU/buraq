const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: { type: String, required: true, enum: ["Credit", "Debit"] },
    metadata: {
      description: {
        type: String,
        required: true,
        default: "Wallet Transaction",
      },
    },
    status: {
      type: String,
      enum: ["TXN_SUCCESS", "TXN_FAILURE", "PENDING"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);

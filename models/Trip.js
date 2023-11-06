const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TripSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    pickup: {
      pickUpAddress: {
        type: String,
        required: true,
      },
      latLng: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    destination: {
      destinationAddress: {
        type: String,
        required: true,
      },
      latLng: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    driver: { type: Schema.Types.ObjectId, ref: "Users" },
    status: {
      type: String,
      enum: ["ongoing", "completed", "cancelled"],
      default: "ongoing",
    },
    fare: {
      type: Number,
    },
    otp: {
      type: Number,
      required: true,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    // tripType reserve, instant
    // startdate
    // enddate
    // vehicleref
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);

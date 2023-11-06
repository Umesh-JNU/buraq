const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required!"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Passowrd is required!"],
    },
    city: {
      type: String,
      required: [true, "City is required!"],
    },
    role: {
      type: String,
      // default: "car-owner",
      enum: ["car-owner", "partner-driver", "buraq moto", "admin", "passenger"],
      required: [true, "Role is required!"],
    },
    proofResidence: {
      type: String,
    },
    license: {
      imageUrl: {
        type: String,
        // required: true,
      },
      expiration: {
        type: Date,
        default: "",
      },
    },
    panCard: {
      type: String,
      // required: true,
    },
    registration: {
      type: String,
      // required: true,
    },
    profilePic: {
      type: String,
      // required: [true, 'Profile Pic is required!'],
    },
    inviteCode: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    acceptedRides: {
      type: Number,
    },
    cancelledRides: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);

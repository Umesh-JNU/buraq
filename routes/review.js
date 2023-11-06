const express = require("express");

const { auth } = require("../middlewares/auth");
const { addReview, getReview } = require("../controller/review");

const router = express.Router();

// this api is used to give add review about the driver from the rider side.
router.post("/add-review", auth, addReview);

// this api is used to get all reviews for particular driver on the driver side.
router.get("/get-reviews", auth, getReview);

module.exports = router;

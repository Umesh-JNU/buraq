const express = require("express");

const { auth } = require("../middlewares/auth");
const { addBank, getBank } = require("../controller/bank");

const router = express.Router();

// route for adding bank details. this api will be used on the driver side to add his/her bank details
router.post("/add-bank", auth, addBank);

// route for getting bank details. this api will be used on the driver side to get his/her bank details
router.get("/get-bank", auth, getBank);

module.exports = router;

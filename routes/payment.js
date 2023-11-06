const express = require("express");

const { auth } = require("../middlewares/auth");
const { addPaymentMode, getPayment } = require("../controller/paymentMode");

const router = express.Router();

router.post("/add-payment", auth, addPaymentMode);

router.get("/get-payments", auth, getPayment);

module.exports = router;

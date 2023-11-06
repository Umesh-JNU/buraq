const Payment = require("../models/Payment");

exports.addPaymentMode = async (req, res, next) => {
  const { name } = req.body;

  try {
    const newPaymentMode = new Payment({
      userId: req.userId,
      name: name,
    });

    const paymentMode = await newPaymentMode.save();
    res.status(200).json(paymentMode);
  } catch (err) {
    console.log("payment add err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getPayment = async (req, res, next) => {
  try {
    const payment = Payment.find();

    if (!payment) {
      res.status(404).json({ msg: "No paymeny available!" });
      return;
    }

    res.status(200).json(payment);
  } catch (err) {
    console.log("payment err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

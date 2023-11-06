const Wallet = require("../models/Wallet");

exports.addWallet = async (req, res, next) => {
  const { balance } = req.body;

  try {
    const alreadyWallet = await Wallet.findOne({ userId: req.userId });
    if (alreadyWallet) {
      const wallet = await Wallet.findByIdAndUpdate(
        alreadyWallet._id,
        { balance: alreadyWallet.balance + balance },
        { new: true }
      );

      return res.status(200).json(wallet);
    } else {
      const newWallet = new Wallet({
        userId: req.userId,
        balance: balance,
      });

      const savedWallet = await newWallet.save();

      return res.status(200).json(savedWallet);
    }
  } catch (err) {
    console.log("add wallet err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.userId });

    if (!wallet) {
      res.status(404).json({ msg: "No wallet found for the current user!" });
      return;
    }

    res.status(200).json(wallet);
  } catch (err) {
    console.log("get wallet err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateWallet = async (req, res, next) => {
  const { balance } = req.body;

  try {
    const wallet = await Wallet.findByIdAndUpdate(
      req.params.id,
      { balance },
      { new: true }
    );

    res.status(200).json(wallet);
  } catch (err) {
    console.log("update wallet err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

// for admin
exports.getAllWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.find().populate("userId");

    res.status(200).json(wallet);
  } catch (err) {
    console.log("get all wallet err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getWalletDetails = async (req, res, next) => {
  try {
    const wallet = await Wallet.findById(req.params.id).populate("userId");

    res.status(200).json(wallet);
  } catch (err) {
    console.log("get wallet details err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateWallet = async (req, res, next) => {
  const { balance } = req.body;
  try {
    const wallet = await Wallet.findByIdAndUpdate(
      req.params.id,
      { balance: balance },
      { new: true }
    );

    res.status(200).json(wallet);
  } catch (err) {
    console.log("update wallet err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

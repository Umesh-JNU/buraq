const Transaction = require("../models/TransactionSchema");

exports.withdrawal = async (req, res, next) => {
  const { amount, type, description, status } = req.body;

  try {
    const newTransaction = new Transaction({
      user: req.userId,
      amount: amount,
      type: type,
      metadata: {
        description: description,
      },
      status: status,
    });

    // const transactionExists = await Transaction.findOne({ user: req.userId });
    // if (transactionExists) {
    //   res.status(409).json({ msg: "Transaction already exists!" });
    //   return;
    // }

    const savedTransaction = await newTransaction.save();

    res.status(200).json(savedTransaction);
  } catch (err) {
    console.log("transaction withdraw err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.userId });

    if (!transactions) {
      res.status(404).json({ msg: "No transactions exists!" });
      return;
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.log("get all transactions err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { amount, type, description, status } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, type, description, status },
      { new: true }
    );

    res.status(200).json(transaction);
  } catch (err) {
    console.log("transaction update err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

//admin side
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().populate("user");

    res.status(200).json(transactions);
  } catch (err) {
    console.log("get all transaction err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "user"
    );

    res.status(200).json(transaction);
  } catch (err) {
    console.log("get transaction err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateUserTransaction = async (req, res, next) => {
  const { amount, type, description, status } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, type, description, status },
      { new: true }
    );

    res.status(200).json(updatedTransaction);
  } catch (err) {
    console.log("update transaction err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.createTransaction = async (req, res, next) => {
  const { amount, type, description, status } = req.body;

  try {
  } catch (err) {
    console.log("create admin transaction err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

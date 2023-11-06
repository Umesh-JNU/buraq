const Bank = require("../models/Bank");

exports.addBank = async (req, res, next) => {
  // extracting all the information needed from the body
  const { firstname, lastname, accountNum, branchName, post_code, city, dob } =
    req.body;

  try {
    // creating new Bank object with all the fields
    const newBank = new Bank({
      userId: req.userId,
      firstname: firstname,
      lastname: lastname,
      accountNum: accountNum,
      branchName: branchName,
      post_code: post_code,
      city: city,
      dob: dob,
    });

    // now checking whether the particular bank is already added or not.
    // account number is a unique field
    const alreadyExists = await Bank.findOne({ accountNum: accountNum });
    if (alreadyExists) {
      res.status(409).json({ msg: "Bank already exists!" });
      return;
    }

    const savedBank = await newBank.save();

    res.status(200).json(savedBank);
  } catch (err) {
    console.log("add bank err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getBank = async (req, res, next) => {
  // getting the bank details for the particular user from req.userId that was set in auth.js
  try {
    const bank = await Bank.find({ userId: { $eq: req.userId } });

    if (!bank) {
      res.status(404).json({ msg: "No bank found!" });
      return;
    }

    res.status(200).json(bank);
  } catch (err) {
    console.log("get bank err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

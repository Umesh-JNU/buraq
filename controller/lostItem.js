const LostItemModel = require("../models/LostItemModel");

exports.addLostItem = async (req, res, next) => {
  // extracting details from body
  const { details } = req.body;

  try {
    // creating new lost item object
    const newLostItem = new LostItemModel({
      user: req.userId,
      details,
    });

    const savedLostItem = await newLostItem.save();

    res.status(200).json(savedLostItem);
  } catch (err) {
    console.log("add lost item err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

const FamilyMembersModel = require("../models/FamilyMembersModel");

exports.addFamilyMember = async (req, res, next) => {
  // extracting all the information needed from the body
  const { name, mobile, age } = req.body;

  try {
    // creating new family member object with all the fields
    const newFamilyMember = new FamilyMembersModel({
      user: req.userId,
      name,
      mobile,
      age,
    });

    // now checking whether the particular family member has already been added or not.
    // mobile number is a unique field
    const alreadyExists = await FamilyMembersModel.findOne({ mobile: mobile });
    if (alreadyExists) {
      res.status(409).json({ msg: "Family member already exists!" });
      return;
    }

    const savedFamilyMember = await newFamilyMember.save();

    res.status(200).json(savedFamilyMember);
  } catch (err) {
    console.log("add family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getFamilyMembers = async (req, res, next) => {
  // getting the family member list for the particular user from req.userId that was set in auth.js
  try {
    const familyMembers = await FamilyMembersModel.find({ user: req.userId });

    if (!familyMembers) {
      res.status(404).json({ msg: "No family members added!" });
      return;
    }

    res.status(200).json(familyMembers);
  } catch (err) {
    console.log("get family membs err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getFamilyMember = async (req, res, next) => {
  // getting a single family member details for the particular id from params that was sent from frontend
  try {
    const familyMember = await FamilyMembersModel.findById(req.params.id);

    if (!familyMember) {
      res.status(404).json({ msg: "No family member!" });
      return;
    }

    res.status(200).json(familyMember);
  } catch (err) {
    console.log("get family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateFamilyMember = async (req, res, next) => {
  // updating a single family member details for the particular id from params that was sent from frontend

  // extracting all the necessary info from req.body
  const { name, age, mobile } = req.body;

  try {
    // mobile length check
    if (mobile?.length < 10) {
      return res
        .status(401)
        .json({ msg: "Phone must be atleast 10 characters" });
    }

    // updating family member
    const familyMember = await FamilyMembersModel.findByIdAndUpdate(
      req.params.id,
      { name, age, mobile },
      { $new: true, runValidators: true }
    );

    res.status(200).json(familyMember);
  } catch (err) {
    console.log("update family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.deleteFamilyMember = async (req, res, next) => {
  // deleting a family member from the params id from the frontend
  try {
    const familyMember = await FamilyMembersModel.findOne({
      _id: req.params.id,
    });

    if (!familyMember) {
      res.status(404).json({ msg: "No family member found!" });
      return;
    }

    await FamilyMembersModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Family member deleted!" });
  } catch (err) {
    console.log("update family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

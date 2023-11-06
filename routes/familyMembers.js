const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addFamilyMember,
  getFamilyMembers,
  getFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} = require("../controller/familyMembers");

const router = express.Router();

// this api is used on the rider side. he/she can add family members
router.post("/add-family", auth, addFamilyMember);

// this api is used on the rider side. this is used to get-all family members list for that user/rider
router.get("/getAll-family", auth, getFamilyMembers);

// this api is used on the rider side. this is used to get particular family member info for that user/rider
router.get("/get-family/:id", auth, getFamilyMember);

// this api is used on the rider side. this is used to update particular family member for that user/rider by passing the id
router.put("/update-family/:id", auth, updateFamilyMember);

// this api is used on the rider side. this is used to delete particular family member for that user/rider by passing the id
router.delete("/delete-family/:id", auth, deleteFamilyMember);

module.exports = router;

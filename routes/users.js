const express = require("express");

const {
  register,
  login,
  updateProfile,
  getProfile,
  changePassword,
  verifyMobileNumber,
  sendOtp,
  verifyMobileNumberDriver,
  verifyMobileFrgPwd,
  updateDocuments,
  getDocsCompleted,
  deleteAcc,
  updateStatus,
} = require("../controller/users");
const { auth } = require("../middlewares/auth");

const router = express.Router();

// user register route
router.post("/register", register);

// user login route
router.post("/login", login);

// for sending otp to the provided otp
router.post("/send-otp", sendOtp);

// for verifying otp for the driver login
router.post("/verify-otp", verifyMobileNumber);

// for verifying otp when forget password is used
router.post("/verify-otp-forget", verifyMobileFrgPwd);

// for verifying otp for the driver signup
router.post("/verify-otp-signup", verifyMobileNumberDriver);

// for updating user profile
router.put("/update-profile", auth, updateProfile);

// for updating user docs
router.put("/update-document", auth, updateDocuments);

// getting user profile details
router.get("/user-profile", auth, getProfile);

// getting user completed docs details
router.get("/user-completedDocs", auth, getDocsCompleted);

// getting user delete acc
router.delete("/user-deleteAcc/:id", auth, deleteAcc);

// for updating user status
router.put("/update-status", auth, updateStatus);

// reset password link
router.put("/reset-password", changePassword);

module.exports = router;

const express = require("express");

const { auth, isAdmin } = require("../middlewares/auth");
const {
  adminLogin,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  adminRegister,
  verifyUser,
  getUsersNum,
} = require("../controller/users");
const {
  getAllWallet,
  getWalletDetails,
  updateWallet,
} = require("../controller/wallet");
const {
  getAllTransactions,
  getTransaction,
  updateUserTransaction,
} = require("../controller/transaction");
const { getAllTrips, getTrip, updateTrip } = require("../controller/trip");

const router = express.Router();

//admin login
router.post("/login", adminLogin);

// for users
router.get("/all-users", auth, isAdmin, getAllUsers);
router.get("/user/:id", auth, isAdmin, getUser);
router.put("/update-user/:id", auth, isAdmin, updateUser);
router.put("/verify-user/:id", auth, isAdmin, verifyUser);
router.delete("/delete-user/:id", auth, isAdmin, deleteUser);

// wallet
router.get("/all-wallet", auth, isAdmin, getAllWallet);
router.get("/wallet/:id", auth, isAdmin, getWalletDetails);
router.put("/update-wallet/:id", auth, isAdmin, updateWallet);

// transaction
router.get("/all-transaction", auth, isAdmin, getAllTransactions);
router.get("/transaction/:id", auth, isAdmin, getTransaction);
router.put("/update-transaction/:id", auth, isAdmin, updateUserTransaction);

// trips
router.get("/all-trips", auth, isAdmin, getAllTrips);
router.get("/trip/:id", auth, isAdmin, getTrip);
router.put("/update-trip/:id", auth, isAdmin, updateTrip);

module.exports = router;

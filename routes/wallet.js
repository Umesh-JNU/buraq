const express = require("express");

const { auth } = require("../middlewares/auth");
const { addWallet, getWallet, updateWallet } = require("../controller/wallet");

const router = express.Router();

// adding into wallet
router.post("/add-wallet", auth, addWallet);

// getting wallet details
router.get("/get-wallet", auth, getWallet);

// updating wallet details
router.put("/update-wallet/:id", auth, updateWallet);

module.exports = router;

const express = require("express");

const { auth } = require("../middlewares/auth");
const { addLostItem } = require("../controller/lostItem");

const router = express.Router();

// this api is used on rider side. the rider/user can post about any item that he forgot on his drive
router.post("/add-lostItem", auth, addLostItem);

module.exports = router;

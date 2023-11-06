const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addTransaction,
  withdrawal,
  updateTransaction,
  getAllTransactions,
  getAll,
} = require("../controller/transaction");

const router = express.Router();

// updating particular transaction
router.put("/update-transaction/:id", auth, updateTransaction);

// adding transaction
router.post("/transaction-withdrawal", auth, withdrawal);

// getting all the transactions made by that user
router.get("/all", auth, getAll);
// router.delete("/delete-transaction/:id", auth, deleteTransaction);

module.exports = router;

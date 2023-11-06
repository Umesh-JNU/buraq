const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addVehicle,
  getAllVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controller/vehicle");

const router = express.Router();

// for adding vehicles from driver side to add his/her vehicle
router.post("/add-vehicle", auth, addVehicle);

// for getting-all vehicles for that driver
router.get("/all", auth, getAllVehicle);

// for getting single vehicle info
router.get("/:id", auth, getVehicle);

// for updating single vehicle info
router.put("/update-vehicle/:id", auth, updateVehicle);

// for deleting single vehicle info
router.delete("/delete/:id", auth, deleteVehicle);

module.exports = router;

const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addTrips,
  getTripsRider,
  getTripsDriver,
  viewTrip,
} = require("../controller/trip");

const router = express.Router();

// for adding trip
router.post("/add-trip", auth, addTrips);

// for getting trips details rider side
router.get("/get-trips-rider", auth, getTripsRider);

// for getting trips details driver side
router.get("/get-trips-driver", auth, getTripsDriver);

// for getting single trip details
router.get("/view-trip/:id", auth, viewTrip);

module.exports = router;

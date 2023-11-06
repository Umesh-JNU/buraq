const Trip = require("../models/Trip");

exports.addTrips = async (req, res, next) => {
  // extracting all the necessary info
  const {
    pickUpAddress,
    latitude,
    longitude,
    destinationAddress,
    destinationLat,
    destinationLng,
    status,
    fare,
    otp,
    payment,
  } = req.body;

  try {
    const newTrip = new Trip({
      user: req.userId,
      pickup: {
        pickUpAddress,
        latLng: {
          latitude,
          longitude,
        },
      },
      destination: {
        destinationAddress,
        latLng: {
          latitude: destinationLat,
          longitude: destinationLng,
        },
      },
      driver: req.userId,
      status,
      fare,
      otp,
      payment,
    });

    const savedTrip = await newTrip.save();

    res.status(200).json(savedTrip);
  } catch (err) {
    console.log("add trip err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getTripsRider = async (req, res, next) => {
  // getting all the trips made by that user/rider
  try {
    const trips = await Trip.find({ user: req.userId }).populate("user");

    if (!trips) {
      res.status(404).json({ msg: "No trips made!" });
      return;
    }

    res.status(200).json(trips);
  } catch (error) {
    console.log("get  trips err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getTripsDriver = async (req, res, next) => {
  // getting all the trips made by that driver
  try {
    const trips = await Trip.find({ driver: req.userId }).populate("user");

    if (!trips) {
      res.status(404).json({ msg: "No trips made!" });
      return;
    }

    res.status(200).json(trips);
  } catch (error) {
    console.log("get  trips err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.viewTrip = async (req, res, next) => {
  // to view any particular trip
  try {
    const trip = await Trip.findById(req.params.id).populate("user");

    res.status(200).json(trip);
  } catch (err) {
    console.log("get trip err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

//admin side
exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().populate("user");

    res.status(200).json(trips);
  } catch (err) {
    console.log("get all trips err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("user");

    res.status(200).json(trip);
  } catch (err) {
    console.log("get trip err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateTrip = async (req, res, next) => {
  const {
    fare,
    pickupAddr,
    pickupLat,
    pickupLong,
    destinationAddr,
    destinationLat,
    destinationLong,
    status,
  } = req.body;

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        "pickup.pickUpAddress": pickupAddr,
        "pickup.latLng.latitude": pickupLat,
        "pickup.latLng.longitude": pickupLong,
        "destination.destinationAddress": destinationAddr,
        "destination.latLng.latitude": destinationLat,
        "destination.latLng.longitude": destinationLong,
        fare,
        status,
      },
      { new: true }
    );

    res.status(200).json(updatedTrip);
  } catch (err) {
    console.log("update trip err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

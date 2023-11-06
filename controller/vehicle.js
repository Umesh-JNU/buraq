const Vehicle = require("../models/Vehicles");

exports.addVehicle = async (req, res, next) => {
  // extracting all necessary info from body
  const { brand, model, year, license, image, type } = req.body;

  try {
    const newVehicle = new Vehicle({
      userId: req.userId,
      brand: brand,
      model: model,
      year: year,
      license: license,
      image: image,
      type: type,
    });

    // checking if the vehicle is alreadt added or not
    const alreadyExist = await Vehicle.findOne({ license: license });
    if (alreadyExist) {
      res.status(409).json({ msg: "Vehicle already exists!" });
      return;
    }

    const savedVehicle = await newVehicle.save();
    res.status(200).json(savedVehicle);
  } catch (err) {
    console.log("add vehicle err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getVehicle = async (req, res, next) => {
  // getting a single vehicle info
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      res.status(404).json({ msg: "No vehicle found!" });
      return;
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.log("get vehicle err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getAllVehicle = async (req, res, next) => {
  // getting all vehicles list for that driver
  try {
    const vehicle = await Vehicle.find({ userId: req.userId });

    if (!vehicle) {
      res.status(404).json({ msg: "No vehicles found for the current user!" });
      return;
    }

    res.status(200).json(vehicle);
  } catch (err) {
    console.log("get all vehicle err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateVehicle = async (req, res, next) => {
  // updating a single vehicle with the info changed
  const { brand, model, year } = req.body;

  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { brand, model, year },
      { new: true }
    );

    res.status(200).json(vehicle);
  } catch (err) {
    console.log("update vehicle err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Vehicle deleted!" });
  } catch (err) {
    console.log("delete vehicle err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

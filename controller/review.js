const { default: mongoose } = require("mongoose");
const RatingModel = require("../models/RatingModel");
const ReviewModel = require("../models/ReviewModel");
const User = require("../models/Users");
const Trip = require("../models/Trip");

exports.addReview = async (req, res, next) => {
  // extracting all the necessary info from the body
  // here the driver is the id of the driver to whom the rider/user is giving review
  const { driver, comment, rating, compliment } = req.body;

  try {
    // checking wehther the rating is greater than 0 or not
    if (rating <= 0) {
      return res
        .status(401)
        .json({ msg: "Rating value should be more than zero." });
    }

    // checking wehther the driver exists or not
    const currDriver = await User.findById(driver);
    if (!currDriver) {
      return res.status(404).json({ msg: "Driver not found." });
    }

    // checking wehther the user exists or not
    const currUser = await User.findById(req.userId);
    if (!currUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    // counting the number of times this particular driver has received or has reviews
    const num = await ReviewModel.count({ driver });

    if (num === 0) {
      // creating new Rating object in which we store the rating info for particular driver
      const newRating = new RatingModel({
        driver,
        rating: rating.toFixed(1),
      });

      await newRating.save();
    } else {
      // this case indicates that the number of times this particular driver has received or has reviews
      // is greater than 0. So, we know that this driver already has some rating we need to update that
      // we find that driver from rating model
      const updateRating = await RatingModel.findOne({ driver: driver });

      // this is the formula for calculating rating
      const updatedRating = (updateRating.rating + rating) / (num + 1);

      // updating rating
      updateRating.rating = updatedRating.toFixed(1);

      await updateRating.save();
    }

    const newReview = new ReviewModel({
      user: req.userId,
      driver,
      rating,
      compliment,
      comment,
    });

    const savedReview = await newReview.save();

    res.status(200).json(savedReview);
  } catch (err) {
    console.log("add review err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getReview = async (req, res, next) => {
  // as this api is called only from the driver side we know that req.userId = driver
  const driver = req.userId;
  const date = new Date();
  const year = date.getFullYear();

  try {
    // finding the driver from database
    const currDriver = await User.findById(req.userId);
    if (!currDriver) {
      return res.status(404).json({ msg: "Driver not found." });
    }

    // getting the list of reviews for that driver
    const review = await ReviewModel.find({ driver: driver });

    const totalAcceptance =
      currDriver.acceptedRides + currDriver.cancelledRides;
    const acceptanceRate = (currDriver.acceptedRides / totalAcceptance) * 100;
    const cancelationRate = (currDriver.cancelledRides / totalAcceptance) * 100;

    const numberOfRides = await Trip.aggregate([
      {
        $match: {
          driver: new mongoose.Types.ObjectId(driver),
        },
      },
      // {
      //   $project: {
      //     year: { $year: "$currDriver.createdAt" },
      //   },
      // },
      {
        $group: {
          _id: 0,
          totalTrips: { $sum: 1 },
        },
      },
    ]);

    const totalYears = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(driver),
        },
      },
      {
        $group: {
          _id: null,
          year: {
            $avg: {
              $dateDiff: {
                startDate: "$createdAt",
                endDate: date,
                unit: "year",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          numYears: "$year",
        },
      },
    ]);

    const totalRidesDone = {
      totalTrips: numberOfRides[0].totalTrips,
      totalYears: totalYears[0].numYears === 0 ? 1 : totalYears[0].numYears,
    };

    const complimentCount = await ReviewModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  compliment: "Excellent Service",
                },
                {
                  compliment: "Expert Navigation",
                },
                {
                  compliment: "Awesome Service",
                },
                {
                  compliment: "Neet & Tidy",
                },
              ],
            },
            {
              driver: new mongoose.Types.ObjectId(driver),
            },
          ],
        },
      },
      // {
      //   $addFields: {
      //     complimentCount: { $sum: 1 },
      //   },
      // },
      // {
      //   $group: {
      //     _id: {
      //       user: "$user",
      //       driver: "$driver",
      //       rating: "$rating",
      //       compliment: "$compliment",
      //       comment: "$comment",
      //       createdAt: "$createdAt",
      //       updatedAt: "$updatedAt",
      //     },
      //     count: { $sum: 1 },
      //   },
      // },
      { $group: { _id: "$compliment", count: { $sum: 1 } } },
    ]);

    // getting ratings for that driver
    const rating = await RatingModel.findOne({ driver: req.userId });

    res.status(200).json({
      review,
      rating,
      complimentCount,
      acceptanceRate,
      cancelationRate,
      totalRidesDone,
    });
  } catch (err) {
    console.log("get reviews err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

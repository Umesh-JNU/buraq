const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsyncError = require('../util/catchAsyncError');
const { s3Uploadv2 } = require("../util/s3");


const { TWILIO_SID, TWILIO_TOKEN } = process.env;
console.log({ TWILIO_SID, TWILIO_TOKEN })
const client = require("twilio")(
  TWILIO_SID,
  TWILIO_TOKEN,
  { lazyLoading: true }
);

exports.register = catchAsyncError(async (req, res, next) => {
  // extracting all the necessary info
  const {
    firstname,
    lastname,
    email,
    mobile,
    password,
    city,
    role,
    imageUrl,
    panCard,
    registration,
    profilePic,
    inviteCode,
  } = req.body;

  if (!password) {
    return res.status(400).json({ msg: "Password is required." });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  let verified = false;
  try {
    // if the role is passenger i.e. if the passenger is signing up then from start we are setting it as verified true
    if (role === "passenger") {
      verified = true;
    }

    // creating a new user object
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobile: mobile,
      password: hashedPwd,
      city: city,
      role: role,
      license: {
        imageUrl,
      },
      panCard: panCard,
      registration: registration,
      profilePic: profilePic,
      inviteCode,
      verified: verified,
    });

    // checking for the old user, email is unique
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      res.status(409).json({ msg: "Email already exists!" });
      return;
    }

    // checking for the old user, mobile is unique
    const oldUserMobile = await User.findOne({ mobile: mobile });
    if (oldUserMobile) {
      res.status(409).json({ msg: "Mobile number already exists!" });
      return;
    }

    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const savedUser = await newUser.save();
    res.status(200).json({ savedUser, token });
  } catch (err) {
    console.log("register err ", err);
    res.status(500).json({
      status: "error",
      errors: err.message,
    });
  }
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ msg: "Incorrect email or password." });
      return;
    }

    const decryptedPw = await bcrypt.compare(password, user.password);
    console.log(decryptedPw);
    if (!decryptedPw) {
      res.status(400).json({ msg: "Incorrect email or password." });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.log("login err ", err);
    res.status(500).json({ status: "error", errors: err.message });
  }
};

exports.sendOtp = async (req, res, next) => {
  // extracting the country code and the mobile number for sending otp
  const { countryCode, phoneNumber } = req.body;

  if (!countryCode || !phoneNumber) {
    return res.status(401).json({ msg: "Enter all Required fields" });
  }

  try {
    // sending otp to the provided mobile number
    const otpResponse = await client.verify
      .services("VAc5765b2512a65da35cbf9e3e352d67e6")
      .verifications.create({
        to: `+${countryCode}${phoneNumber}`,
        channel: "sms",
      });

    console.log("res ", otpResponse);

    res.status(201).json({ msg: "OTP send succesfully!" });
  } catch (error) {
    console.error("send otp err ", error);
    return res.status(500).json({ msg: "Server Error", error });
  }
};

exports.verifyMobileNumber = async (req, res, next) => {
  // extracting info for verifying otp for the driver login
  const { countryCode, phoneNumber, otp, password } = req.body;

  if (!countryCode || !phoneNumber || !otp) {
    return res.status(401).json({ msg: "Enter all Required fields" });
  }

  try {
    // finding the user with the given phone number
    const user = await User.findOne({ mobile: phoneNumber });

    // verifying otp
    const verificationResponse = await client.verify
      .services("VAc5765b2512a65da35cbf9e3e352d67e6")
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });

    if (verificationResponse.valid) {
      // otp verified but user does not exists
      if (!user) {
        return res.status(200).json({
          status: "Otp verified!",
          phoneNumber: phoneNumber,
        });
      }

      // comparing passwords
      const decryptedPw = await bcrypt.compare(password, user.password);
      if (!decryptedPw) {
        res.status(400).json({ msg: "Incorrect password!" });
        return;
      }

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      res.status(200).json({ user, token });
    } else {
      res.status(400).json({ status: "Wrong OTP!" });
    }
  } catch (err) {
    console.log("verify mobile err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.verifyMobileNumberDriver = async (req, res, next) => {
  // extracting info for verifying otp for the driver signup
  const { countryCode, phoneNumber, otp } = req.body;

  if (!countryCode || !phoneNumber || !otp) {
    return res.status(401).json({ msg: "Enter all Required fields" });
  }

  try {
    // finding the user with the given phone number
    const user = await User.findOne({ mobile: phoneNumber });

    // verifying otp
    const verificationResponse = await client.verify
      .services("VAc5765b2512a65da35cbf9e3e352d67e6")
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });

    if (verificationResponse.valid) {
      // otp verified but user does not exists
      if (!user) {
        res.status(200).json({
          status: "Otp verified!",
          phoneNumber: phoneNumber,
        });
        return;
      }

      const token = await jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      res.status(200).json({ user, token });
    } else {
      res.status(400).json({ status: "Wrong OTP!" });
    }
  } catch (err) {
    console.log("verify mobile err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.verifyMobileFrgPwd = async (req, res, next) => {
  // extracting info for verifying otp when forget password is used
  const { countryCode, phoneNumber, otp } = req.body;

  if (!countryCode || !phoneNumber || !otp) {
    return res.status(401).json({ msg: "Enter all Required fields" });
  }

  try {
    const verificationResponse = await client.verify
      .services("VAc5765b2512a65da35cbf9e3e352d67e6")
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });

    if (verificationResponse.valid) {
      return res.status(200).json({
        status: "Otp verified!",
        phoneNumber: phoneNumber,
      });
    } else {
      res.status(400).json({ status: "Wrong OTP!" });
      return;
    }
  } catch (err) {
    console.log("verify mobile frPw err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateProfile = async (req, res, next) => {
  const newUserDetails = {
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };

  if (req.file) {
    const results = await s3Uploadv2(req.file);
    const location = results.Location && results.Location;
    if (location) newUserDetails.profilePic = location;
  }

  console.log({ newUserDetails })
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      newUserDetails,
      // {
      //   firstname,
      //   lastname,
      //   profilePic,
      //   // mobile,
      //   // email,
      //   // role,
      // },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("update profile err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateDocuments = async (req, res, next) => {
  try {
    const updatedDocs = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });

    res.status(200).json(updatedDocs);
  } catch (err) {
    console.log("update docs err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getProfile = async (req, res, next) => {
  // getting user details
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("get profile err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getDocsCompleted = async (req, res, next) => {
  console.log("getDocsCompleted")
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
      return;
    }

    const doc = {
      pan_card: user?.panCard !== undefined,
      proof_residence: user?.proofResidence !== undefined,
      proof_drivingLicence: user?.license?.imageUrl !== undefined
    };

    console.log({ doc });
    res.status(200).json({
      ...user._doc,
      ...doc
    });
  } catch (err) {
    console.log("get completed docs err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.changePassword = async (req, res, next) => {
  // changing password
  const { password, mobile } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  try {
    const user = await User.findOne({ mobile: mobile });

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
      return;
    }

    user.password = hashedPwd;
    await user.save();

    res.status(200).json({ msg: "Password updated!" });
  } catch (err) {
    console.log("passwodd update err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.deleteAcc = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Account deleted!" });
  } catch (err) {
    console.log("deleting user acc err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateStatus = async (req, res, next) => {
  const { role } = req.body;
  try {
    const updatedStatus = await User.findByIdAndUpdate(
      req.userId,
      { role: role },
      {
        new: true,
      }
    );

    res.status(200).json(updatedStatus);
  } catch (err) {
    console.log("update status err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

// admin side -----------
exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ msg: "Incorrect email or password." });
      return;
    }

    const decryptedPw = await bcrypt.compare(password, user.password);
    if (!decryptedPw) {
      res.status(400).json({ msg: "Incorrect email or password." });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.log("admin login err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

// exports.adminRegister = async (req, res, next) => {
//   const { firstname, lastname, email, password, profilePic, city, mobile } =
//     req.body;

//   const salt = await bcrypt.genSalt(10);
//   const hashedPwd = await bcrypt.hash(password, salt);

//   try {
//     const newAdmin = new User({
//       firstname: firstname,
//       lastname: lastname,
//       email: email,
//       password: hashedPwd,
//       role: "admin",
//       city: city,
//       mobile: mobile,
//       profilePic: profilePic,
//     });

//     const oldUser = await User.findOne({ email: email });
//     if (oldUser) {
//       res.status(409).json({ msg: "Email already exists!" });
//       return;
//     }

//     const token = jwt.sign(
//       {
//         userId: newAdmin._id,
//       },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     const savedAdmin = await newAdmin.save();
//     res.status(200).json({ savedAdmin, token });
//   } catch (err) {
//     console.log("admin register err ", err);
//     res.status(500).json({ err, msg: "Error from server!" });
//   }
// };

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    console.log("getting all users err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("getting a user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "User deleted!" });
  } catch (err) {
    console.log("deleting user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateUser = async (req, res, next) => {
  // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
  //   runValidators: false,
  //   new: true
  // })
  const { firstname, lastname, city, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        firstname,
        lastname,
        city,
        role,
      }
      // { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("updating user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.verifyUser = async (req, res, next) => {
  // admin will verify the driver from the license details
  const { expiryDate } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    // const verifiedUser = await User.updateOne(
    //   { _id: req.params.id },
    //   { $set: { license: { expiration: expiryDate }, verified: true } }
    // );

    // setting the expiry license date to the date sent from admin
    const verifiedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        "license.expiration": expiryDate,

        verified: true,
      },

      { new: true }
    );

    res.status(200).json({ msg: "Done!" });
  } catch (err) {
    console.log("verify user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getUsersNum = async (req, res, next) => {
  // getting number of users
  try {
    const users = await User.find({ role: { $ne: "admin" } });

    const usersLength = await users?.length;

    res.status(200).json(usersLength);
  } catch (err) {
    console.log("get users num err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

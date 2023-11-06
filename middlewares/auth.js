const jwt = require("jsonwebtoken");
const User = require("../models/Users");

exports.auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ msg: "Unauthorized.Please Send token in request header" });
    }

    console.log("yes");
    const { userId } = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );

    console.log(userId);

    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ msg: "Invalid token. User not found!" });
      return;
    }

    if (user.role !== "admin") {
      res.status(401).json({ msg: "Restricted!" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized!" });
  }
};

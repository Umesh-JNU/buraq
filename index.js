const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const errorHandler = require('./middlewares/error');

const path = './config/config.env';
dotenv.config({ path });

const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payment");
const vehicleRoutes = require("./routes/vehicle");
const bankRoutes = require("./routes/bank");
const walletRoutes = require("./routes/wallet");
const transactionRoutes = require("./routes/transaction");
const tripRoutes = require("./routes/trip");
const familyMemberRoutes = require("./routes/familyMembers");
const lostItemRoutes = require("./routes/lostItem");
const reviewRoutes = require("./routes/review");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log("Database connected!"))
  .catch((err) => console.log("database err ", err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));

app.get("/", (req, res, next) =>
  res.json({ status: "You have reached buraq backend!" })
);

app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/familyMemb", familyMemberRoutes);
app.use("/api/lostItem", lostItemRoutes);
app.use("/api/review", reviewRoutes);

app.use("/api/admin", adminRoutes);

app.use(errorHandler);
// fair calculation rapid API: https://rapidapi.com/3b-data-3b-data-default/api/taxi-fare-calculator/
// // fair calculation uber api : https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get#resource

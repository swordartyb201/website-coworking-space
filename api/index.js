import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import spacesRoute from "./routes/spaces.js";
import roomsRoute from "./routes/rooms.js";
import orderRoute from "./routes/order.js";
import paypalRoute from "./routes/paypal.js";
import stripeRoute from "./routes/stripe.js";
import "./utils/Scheduler.js";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Da ket noi voi mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB da ngat ket noi!");
});

import express from "express";
const app = express();
const PORT = 8800;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/spaces", spacesRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/order", orderRoute);
app.use("/api/paypal", paypalRoute);
app.use("/api/stripe", stripeRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Đã xảy ra lỗi!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
  connect();
  console.log(`Da ket noi toi cong ${PORT}.`);
});

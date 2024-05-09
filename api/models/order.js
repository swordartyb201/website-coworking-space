import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    dateMode: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    billing: {
      type: String,
      enum: ["Credit Card", "Paypal"],
      default: "Paypal",
    },
    status: {
      type: String,
      enum: ["Chờ thanh toán", "Đã thanh toán"],
      default: "Chờ thanh toán",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);

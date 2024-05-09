import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    roomNumbers: [{ number: String, unavailableDates: { type: [Date] } }],
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);

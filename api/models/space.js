import mongoose from "mongoose";

const SpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    map: {
      type: String,
      required: true,
    },
    ava: {
      type: [String],
    },
    photos: {
      type: [String],
    },
    desc: {
      type: String,
    },
    rooms: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Space", SpaceSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    realname: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    sex: {
      type: String,
      enum: ["Chưa xác định", "Nam", "Nữ"],
      default: "Chưa xác định",
    },
    birthday: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    membership: {
      type: String,
      enum: ["Thường", "Thân thiết", "VIP", "VVIP"],
      default: "Thường",
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

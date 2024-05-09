import Room from "../models/room.js";
import Space from "../models/space.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const spaceId = req.params.spaceid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Space.findByIdAndUpdate(spaceId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $addToSet: {
          "roomNumbers.$.unavailableDates": { $each: req.body.dates },
        },
      }
    );

    res.status(200).json("Trang thai phong da duoc cap nhat");
  } catch (err) {
    console.error(err);
    res.status(500).json("Co loi khi cap nhat trang thai phong");
    next(err);
  }
};

export const removeUnavailableDates = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $pull: {
          "roomNumbers.$.unavailableDates": { $in: req.body.dates },
        },
      }
    );

    res.status(200).json("Ngày đã được xóa khỏi danh sách không khả dụng");
  } catch (err) {
    console.error(err);
    res.status(500).json("Có lỗi khi xóa ngày khỏi danh sách không khả dụng");
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  const spaceId = req.params.spaceid;
  const room = await Room.findById(req.params.id);
  if (!room) {
    return res.status(404).json("Không tìm thấy phòng.");
  }

  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Space.findByIdAndUpdate(spaceId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Phong da duoc xoa");
  } catch (err) {
    console.error(err);
    res.status(500).json("Đã xảy ra lỗi khi xóa phòng.");
    next(err);
  }
};

export const getRoomsByType = async (req, res, next) => {
  const { roomType } = req.params;
  const validRoomTypes = ["Văn phòng ảo", "Văn phòng trọn gói"];

  try {
    // Kiểm tra xem roomType có trong danh sách hợp lệ không
    if (!validRoomTypes.includes(roomType)) {
      return res.status(400).json({ error: "Loai phong khong hop le" });
    }

    // Nếu hợp lệ, thực hiện tìm kiếm phòng
    const rooms = await Room.find({ type: roomType });
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const filterRooms = async (req, res, next) => {
  const { roomType, startDate, endDate } = req.query;

  try {
    // Validate roomType
    if (!validRoomTypes.includes(roomType)) {
      return res.status(400).json({ error: "Invalid room type" });
    }

    // Validate and parse dates
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    // Find rooms that match both criteria
    const rooms = await Room.find({
      type: roomType,
      roomNumbers: {
        $elemMatch: {
          number: { $exists: true },
          unavailableDates: {
            $not: {
              $elemMatch: { $gte: start, $lt: end },
            },
          },
        },
      },
    });

    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoomNumberById = async (req, res, next) => {
  try {
    const { roomId, roomNumberId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomNumber = room.roomNumbers.find(
      (roomNumber) => roomNumber._id.toString() === roomNumberId
    );

    if (!roomNumber) {
      return res.status(404).json({ message: "RoomNumber not found" });
    }

    res.status(200).json(roomNumber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

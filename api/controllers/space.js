import Space from "../models/space.js";
import Room from "../models/room.js";

export const createSpace = async (req, res, next) => {
  const newSpace = new Space(req.body);

  try {
    const savedSpace = await newSpace.save();
    res.status(200).json(savedSpace);
  } catch (err) {
    console.error(err);
    res.status(500).json("Co loi khi tao co so");
    next(err);
  }
};

export const updateSpace = async (req, res, next) => {
  try {
    const updatedSpace = await Space.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedSpace);
  } catch (err) {
    next(err);
  }
};

export const deleteSpace = async (req, res, next) => {
  try {
    await Space.findByIdAndDelete(req.params.id);
    res.status(200).json("Space has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getSpace = async (req, res, next) => {
  try {
    const space = await Space.findById(req.params.id);
    res.status(200).json(space);
  } catch (err) {
    next(err);
  }
};

export const getSpaces = async (req, res, next) => {
  try {
    // Kiểm tra nếu không có query parameter location hoặc giá trị của nó là "Tất cả địa điểm"
    if (!req.query.location || req.query.location === "Tất cả địa điểm") {
      const allSpaces = await Space.find(); // Lấy tất cả các địa điểm
      return res.json(allSpaces);
    }

    // Nếu có địa điểm được chọn, thực hiện logic xử lý thông thường
    const spaces = await Space.find({ location: req.query.location });
    res.json(spaces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const countByLocation = async (req, res, next) => {
  const locations = req.query.locations.split(",");
  try {
    const list = await Promise.all(
      locations.map((location) => {
        return Space.countDocuments({ location: location });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const getSpaceRooms = async (req, res, next) => {
  try {
    const space = await Space.findById(req.params.id);
    const list = await Promise.all(
      space.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const getSpacesByLocation = async (req, res, next) => {
  const { location } = req.query;

  try {
    if (!location) {
      return res.status(400).json({ error: "Location parameter is required" });
    }

    const spaces = await Space.find({ location });

    res.status(200).json(spaces);
  } catch (err) {
    next(err);
  }
};

export const getSpaceByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Tìm phòng với ID đã cho và lấy thông tin không gian của nó
    const space = await Space.findOne({ rooms: roomId }).populate("rooms");

    if (!space) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy không gian cho phòng này" });
    }

    res.status(200).json(space);
  } catch (error) {
    console.error("Error getting space by room ID:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

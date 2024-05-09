import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
  getRoomsByType,
  filterRooms,
  getRoomNumberById,
  removeUnavailableDates,
} from "../controllers/room.js";

import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/filter", filterRooms);

//CREATE
router.post("/:spaceid", verifyAdmin, createRoom);

//UPDATE
router.put("/:id", verifyAdmin, updateRoom);
router.put("/availability/:id", updateRoomAvailability);
//DELETE
router.delete("/:id", verifyAdmin, deleteRoom);
router.delete("/availability/:id", removeUnavailableDates);

//GET
router.get("/:id", getRoom);
router.get("/:roomId/roomNumbers/:roomNumberId", getRoomNumberById);

//GET ALL
router.get("/type/:roomType", getRoomsByType);
router.get("/", getRooms);

export default router;

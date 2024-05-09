import express from "express";
import {
  countByLocation,
  createSpace,
  deleteSpace,
  getSpace,
  getSpaceRooms,
  getSpaces,
  updateSpace,
  getSpacesByLocation,
  getSpaceByRoomId,
} from "../controllers/space.js";
import Space from "../models/space.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createSpace);

//UPDATE
router.put("/:id", verifyAdmin, updateSpace);
//DELETE
router.delete("/:id", verifyAdmin, deleteSpace);
//GET
router.get("/find/:id", getSpace);
router.get("/space/:roomId", getSpaceByRoomId);
router.get("/search", getSpacesByLocation);
//GET ALL

router.get("/", getSpaces);
router.get("/countByLocation", countByLocation);
router.get("/room/:id", getSpaceRooms);

export default router;

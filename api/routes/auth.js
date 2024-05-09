import express from "express";
import {
  login,
  register,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/change-password/:id", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

export default router;

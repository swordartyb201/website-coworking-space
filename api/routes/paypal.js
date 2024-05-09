// paypalRoute.js
import express from "express";
import paypal from "../controllers/paypal.js";

const router = express.Router();

router.post("/pay", paypal.payment);

router.get("/executePayment", paypal.executePayment);

export default router;

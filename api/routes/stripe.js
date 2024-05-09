// checkoutRoutes.js
import express from "express";
import stripePayment from "../controllers/stripe.js";

const router = express.Router();

router.post("/pay", stripePayment);

export default router;

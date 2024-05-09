// ./routes/Order.js
import express from "express";
import Order from "../controllers/order.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyAdmin, Order.getAllOrder);
router.get("/searchByName", Order.searchOrderByName);

router.get("/revenue-stats", Order.getRevenueStats);
router.get("/monthlyStatistics", Order.getMonthlyStatistics);
router.get("/count-total-orders", Order.getTotalOrders);
router.get("/total-orders-price", Order.getTotalPaidOrdersPrice);
router.get(
  "/monthlyLocationStatistics/:spaceId",
  Order.getMonthlyLocationStatistics
);
router.get("/monthlyRoomStatistics/:roomId", Order.getMonthlyRoomStatistics);
router.get("/monthlyUserStatistics/:userId", Order.getMonthlyUserStatistics);
router.get("/totalPrice/:userId", Order.calculateTotalPriceByUserId);
router.get("/:id", Order.getOrderById);
router.get("/space/:spaceId", Order.getOrderBySpaceId);
router.get("/room/:roomId", Order.getOrderByRoomId);
router.get("/user/:userId", Order.getOrderByUserId);

router.put("/:id", Order.updateOrderById);

router.post("/", Order.createOrder);
router.delete("/:id", Order.deleteOrder);

export default router;

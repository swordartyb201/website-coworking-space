import cron from "node-cron";
import Order from "../models/order.js";

// Lập lịch chạy mỗi phút
cron.schedule("* * * * *", async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  try {
    // Xóa các đơn hàng chờ thanh toán lớn hơn 30 phút
    const result = await Order.deleteMany({
      status: "Chờ thanh toán",
      createdAt: { $lt: thirtyMinutesAgo },
    });
    console.log(`${result.deletedCount} đơn đã bị xóa.`);
  } catch (error) {
    console.error("Lỗi xóa đơn hàng:", error);
  }
});

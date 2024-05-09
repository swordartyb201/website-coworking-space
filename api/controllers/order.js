import OrderModel from "../models/order.js";
import UserModel from "../models/user.js";
import SpaceModel from "../models/space.js";
import RoomModel from "../models/room.js";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
} from "date-fns";

const Order = {
  getAllOrder: async (req, res) => {
    try {
      const orders = await OrderModel.find();
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  },

  getTotalPaidOrdersPrice: async (req, res) => {
    try {
      const totalPaidOrdersPrice = await OrderModel.aggregate([
        {
          $match: { status: "Đã thanh toán" },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      res.json({ amount: totalPaidOrdersPrice[0].total });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getOrderById: async (req, res) => {
    const orderId = req.params.id;

    try {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOrderByUserId: async (req, res) => {
    const userId = req.params.userId;

    try {
      const order = await OrderModel.find({ userId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (err) {
      console.error("Error fetching order history:", error);
      res.status(500).json({ message: err.message });
    }
  },

  getOrderBySpaceId: async (req, res) => {
    try {
      const { spaceId } = req.params;
      // Truy vấn spaceModel để lấy thông tin về không gian
      const spaceInfo = await SpaceModel.findById(spaceId);

      if (!spaceInfo) {
        return res.status(404).json({ error: "Space not found" });
      }
      const order = await OrderModel.find({ location: spaceInfo.name });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (err) {
      console.error("Error fetching order history:", error);
      res.status(500).json({ message: err.message });
    }
  },

  getOrderByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
      const roomInfo = await RoomModel.findById(roomId);
      if (!roomInfo) {
        return res.status(404).json({ error: "Room not found" });
      }
      const spaceInfo = await SpaceModel.findOne({ rooms: roomId }).populate(
        "rooms"
      );
      if (!spaceInfo) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy co so cho phòng này" });
      }

      if (!spaceInfo) {
        return res.status(404).json({ error: "Space not found" });
      }
      const order = await OrderModel.find({
        location: spaceInfo.name,
        type: roomInfo.type,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (err) {
      console.error("Error fetching order history:", error);
      res.status(500).json({ message: err.message });
    }
  },

  calculateTotalPriceByUserId: async (req, res) => {
    const userId = req.params.userId;

    try {
      const totalPriceResult = await OrderModel.aggregate([
        {
          $match: { userId: userId, status: "Đã thanh toán" },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      if (totalPriceResult.length > 0) {
        res.status(200).json({ total: totalPriceResult[0].total });
      } else {
        res.status(404).json({ message: "No orders found for the user." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  createOrder: async (req, res) => {
    try {
      const order = new OrderModel({
        userId: req.body.userId,
        roomId: req.body.roomId,
        roomNumber: req.body.roomNumber,
        price: req.body.price,
        duration: req.body.duration,
        dateMode: req.body.dateMode,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        type: req.body.type,
        location: req.body.location,
        billing: req.body.billing,
        status: req.body.status,
      });
      const user = await UserModel.findById(req.body.userId);
      console.log(user);

      const orderList = await order.save();
      res.status(200).json(orderList);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const orderList = await OrderModel.findByIdAndDelete(req.params.id);
      if (!orderList) {
        return res.status(200).json("Order does not exist");
      }
      res.status(200).json("Delete order success");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateOrderById: async (req, res, next) => {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      next(err);
    }
  },

  searchOrderByName: async (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;

    const options = {
      page: page,
      limit: limit,
      populate: "user",
    };

    const name = req.query.name;

    try {
      const orderList = await OrderModel.paginate(
        { billing: { $regex: `.*${name}.*`, $options: "i" } },
        options
      );

      res.status(200).json({ data: orderList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getTotalOrders: async (req, res) => {
    try {
      const amount = await OrderModel.countDocuments();
      res.json({ amount });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMonthlyStatistics: async (req, res) => {
    try {
      const sixMonthsAgo = subMonths(new Date(), 6);
      const orders = await OrderModel.find({
        createdAt: {
          $gte: startOfMonth(sixMonthsAgo),
          $lte: endOfMonth(new Date()),
        },
      });

      const monthlyStatistics = orders.reduce((result, order) => {
        const monthKey = order.createdAt.toISOString().substring(0, 7); // Lấy key là chuỗi YYYY-MM
        result[monthKey] = (result[monthKey] || 0) + order.price;
        return result;
      }, {});

      const chartData = Object.keys(monthlyStatistics).map((month) => ({
        name: month,
        Total: monthlyStatistics[month],
      }));

      res.json({ chartData });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMonthlyUserStatistics: async (req, res) => {
    try {
      const { userId } = req.params;
      const sixMonthsAgo = subMonths(new Date(), 6);
      const orders = await OrderModel.find({
        userId: userId,
        createdAt: {
          $gte: startOfMonth(sixMonthsAgo),
          $lte: endOfMonth(new Date()),
        },
      });

      const monthlyStatistics = orders.reduce((result, order) => {
        const monthKey = order.createdAt.toISOString().substring(0, 7); // Lấy key là chuỗi YYYY-MM
        result[monthKey] = (result[monthKey] || 0) + order.price;
        return result;
      }, {});

      const chartData = Object.keys(monthlyStatistics).map((month) => ({
        name: month,
        Total: monthlyStatistics[month],
      }));

      res.json({ chartData });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMonthlyLocationStatistics: async (req, res) => {
    try {
      const { spaceId } = req.params;
      // Truy vấn spaceModel để lấy thông tin về không gian
      const spaceInfo = await SpaceModel.findById(spaceId);

      if (!spaceInfo) {
        return res.status(404).json({ error: "Space not found" });
      }
      const sixMonthsAgo = subMonths(new Date(), 6);
      const orders = await OrderModel.find({
        location: spaceInfo.name,
        createdAt: {
          $gte: startOfMonth(sixMonthsAgo),
          $lte: endOfMonth(new Date()),
        },
      });

      const monthlyStatistics = orders.reduce((result, order) => {
        const monthKey = order.createdAt.toISOString().substring(0, 7); // Lấy key là chuỗi YYYY-MM
        result[monthKey] = (result[monthKey] || 0) + order.price;
        return result;
      }, {});

      const chartData = Object.keys(monthlyStatistics).map((month) => ({
        name: month,
        Total: monthlyStatistics[month],
      }));

      res.json({ chartData });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMonthlyRoomStatistics: async (req, res) => {
    try {
      const { roomId } = req.params;
      const roomInfo = await RoomModel.findById(roomId);
      if (!roomInfo) {
        return res.status(404).json({ error: "Room not found" });
      }
      const spaceInfo = await SpaceModel.findOne({ rooms: roomId }).populate(
        "rooms"
      );
      if (!spaceInfo) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy co so cho phòng này" });
      }

      const sixMonthsAgo = subMonths(new Date(), 6);
      const orders = await OrderModel.find({
        type: roomInfo.type,
        location: spaceInfo.name,
        createdAt: {
          $gte: startOfMonth(sixMonthsAgo),
          $lte: endOfMonth(new Date()),
        },
      });

      const monthlyStatistics = orders.reduce((result, order) => {
        const monthKey = order.createdAt.toISOString().substring(0, 7); // Lấy key là chuỗi YYYY-MM
        result[monthKey] = (result[monthKey] || 0) + order.price;
        return result;
      }, {});

      const chartData = Object.keys(monthlyStatistics).map((month) => ({
        name: month,
        Total: monthlyStatistics[month],
      }));

      res.json({ chartData });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getRevenueStats: async (req, res) => {
    try {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());

      const thisWeekStart = startOfWeek(new Date());
      const thisWeekEnd = endOfWeek(new Date());

      const thisMonthStart = startOfMonth(new Date());
      const thisMonthEnd = endOfMonth(new Date());

      const lastWeekStart = startOfWeek(subWeeks(new Date(), 1));
      const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1));

      const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
      const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

      const todayRevenue = await OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      const thisWeekRevenue = await OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: thisWeekStart,
              $lte: thisWeekEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      const thisMonthRevenue = await OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: thisMonthStart,
              $lte: thisMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      const lastWeekRevenue = await OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: lastWeekStart,
              $lte: lastWeekEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      const lastMonthRevenue = await OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: lastMonthStart,
              $lte: lastMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      res.json({
        today: todayRevenue.length ? todayRevenue[0].total : 0,
        thisWeek: thisWeekRevenue.length ? thisWeekRevenue[0].total : 0,
        thisMonth: thisMonthRevenue.length ? thisMonthRevenue[0].total : 0,
        lastWeek: lastWeekRevenue.length ? lastWeekRevenue[0].total : 0,
        lastMonth: lastMonthRevenue.length ? lastMonthRevenue[0].total : 0,
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default Order;

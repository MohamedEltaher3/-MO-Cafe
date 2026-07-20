const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// @desc    ملخص عام للوحة التحكم
// @route   GET /api/reports/overview
const getOverview = asyncHandler(async (req, res) => {
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [
    totalOrders,
    todayOrders,
    monthOrders,
    totalCustomers,
    totalProducts,
    revenueAgg,
    monthRevenueAgg,
    pendingOrders,
    topProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfToday } }),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Customer.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ status: "pending" }),
    Product.find().sort({ salesCount: -1 }).limit(5).select("name salesCount price"),
  ]);

  res.json({
    success: true,
    overview: {
      totalOrders,
      todayOrders,
      monthOrders,
      totalCustomers,
      totalProducts,
      totalRevenue: revenueAgg[0]?.total || 0,
      monthRevenue: monthRevenueAgg[0]?.total || 0,
      pendingOrders,
      topProducts,
    },
  });
});

// @desc    مبيعات مجمعة حسب اليوم (للرسم البياني)
// @route   GET /api/reports/sales-by-day?days=30
const getSalesByDay = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const sales = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, paymentStatus: "paid" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, sales });
});

module.exports = { getOverview, getSalesByDay };

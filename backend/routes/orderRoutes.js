const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, hasPermission } = require("../middleware/auth");

router.post("/", createOrder); // عام - Checkout
router.get("/:idOrNumber", getOrder); // عام - تتبع الطلب

router.get("/", protect, hasPermission("orders"), getOrders);
router.patch("/:id/status", protect, hasPermission("orders"), updateOrderStatus);

module.exports = router;

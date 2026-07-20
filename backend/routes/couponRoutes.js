const express = require("express");
const router = express.Router();
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/couponController");
const { protect, hasPermission } = require("../middleware/auth");

router.post("/validate", validateCoupon); // عام - يستخدم في السلة

router.get("/", protect, hasPermission("coupons"), getCoupons);
router.post("/", protect, hasPermission("coupons"), createCoupon);
router.put("/:id", protect, hasPermission("coupons"), updateCoupon);
router.delete("/:id", protect, hasPermission("coupons"), deleteCoupon);

module.exports = router;

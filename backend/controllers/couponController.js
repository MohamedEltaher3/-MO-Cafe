const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, count: coupons.length, coupons });
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    res.status(404);
    throw new Error("الكوبون غير موجود");
  }
  res.json({ success: true, coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("الكوبون غير موجود");
  }
  res.json({ success: true, message: "تم حذف الكوبون" });
});

// @desc    التحقق من صلاحية كوبون قبل تطبيقه في السلة
// @route   POST /api/coupons/validate
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error("كود الخصم غير صحيح");
  }

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    res.status(400);
    throw new Error("كود الخصم منتهي أو لسه ما بدأش");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("تم استهلاك الحد الأقصى لاستخدام هذا الكود");
  }

  if (orderAmount < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`الحد الأدنى للطلب ${coupon.minOrderAmount} لاستخدام هذا الكود`);
  }

  let discount =
    coupon.type === "percentage" ? (orderAmount * coupon.value) / 100 : coupon.value;

  if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
    discount = coupon.maxDiscountAmount;
  }

  res.json({ success: true, discount, coupon });
});

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };

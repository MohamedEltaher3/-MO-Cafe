const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    value: { type: Number, required: true }, // نسبة % أو مبلغ ثابت
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number }, // سقف الخصم لو نسبة
    usageLimit: { type: Number, default: null }, // إجمالي عدد مرات الاستخدام
    usedCount: { type: Number, default: 0 },
    usageLimitPerCustomer: { type: Number, default: 1 },
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);

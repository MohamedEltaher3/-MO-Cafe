const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // snapshot وقت الطلب
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    addons: [{ name: String, price: Number }],
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // رقم الطلب
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    guestInfo: {
      name: String,
      phone: String,
      email: String,
    },
    items: [orderItemSchema],

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["apple_pay", "mada", "visa", "mastercard", "stc_pay", "cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentReference: { type: String }, // من بوابة الدفع

    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        note: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    deliveryAddress: {
      city: String,
      area: String,
      street: String,
      building: String,
      notes: String,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },

    trackingNumber: { type: String }, // تتبع الطلب
    notifiedCustomer: { type: Boolean, default: false }, // إشعارات العميل
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

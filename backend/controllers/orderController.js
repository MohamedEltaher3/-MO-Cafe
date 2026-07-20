const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Coupon = require("../models/Coupon");

// توليد رقم طلب مميز مثل MOC-20260720-0001
const generateOrderNumber = async () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const countToday = await Order.countDocuments({
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });
  return `MOC-${datePart}-${String(countToday + 1).padStart(4, "0")}`;
};

// @desc    إنشاء طلب جديد (Checkout)
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    customerId,
    guestInfo,
    couponCode,
    paymentMethod,
    deliveryAddress,
    branch,
    deliveryFee = 0,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("السلة فارغة");
  }

  // بناء عناصر الطلب من قاعدة البيانات (عشان السعر الحقيقي مش اللي بيبعته العميل)
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`منتج غير متاح: ${item.productId}`);
    }

    const addonsTotal = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
    const itemSubtotal = (product.price + addonsTotal) * item.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      addons: item.addons || [],
      subtotal: itemSubtotal,
    });
  }

  // تطبيق الكوبون لو موجود
  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      discount =
        coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const total = subtotal - discount + Number(deliveryFee);
  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    customer: customerId || undefined,
    guestInfo: customerId ? undefined : guestInfo,
    items: orderItems,
    subtotal,
    discount,
    couponCode,
    deliveryFee,
    total,
    paymentMethod,
    deliveryAddress,
    branch,
    statusHistory: [{ status: "pending", note: "تم استلام الطلب" }],
  });

  // تحديث إحصائيات العميل والمنتجات
  if (customerId) {
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { totalOrders: 1, totalSpent: total },
    });
  }
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } });
  }

  res.status(201).json({ success: true, order });
});

// @desc    عرض كل الطلبات (بفلاتر للوحة التحكم)
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("customer", "name phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    orders,
  });
});

// @desc    عرض طلب واحد بالرقم أو الـ id (لتتبع الطلب)
// @route   GET /api/orders/:idOrNumber
const getOrder = asyncHandler(async (req, res) => {
  const { idOrNumber } = req.params;
  const order = await Order.findOne({
    $or: [
      { _id: idOrNumber.match(/^[0-9a-fA-F]{24}$/) ? idOrNumber : null },
      { orderNumber: idOrNumber },
    ],
  }).populate("customer", "name phone email");

  if (!order) {
    res.status(404);
    throw new Error("الطلب غير موجود");
  }

  res.json({ success: true, order });
});

// @desc    تحديث حالة الطلب
// @route   PATCH /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("الطلب غير موجود");
  }

  order.status = status;
  order.statusHistory.push({ status, note, changedAt: new Date() });
  await order.save();

  // هنا لاحقًا: إرسال إشعار للعميل (SMS/WhatsApp/Email) عند تغيير الحالة
  order.notifiedCustomer = true;
  await order.save();

  res.json({ success: true, order });
});

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };

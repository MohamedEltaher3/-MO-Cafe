const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @desc    عرض كل المنتجات مع فلاتر واختيارية (للوحة التحكم والمتجر)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, featured, isNew, bestSellers, search, page = 1, limit = 20, active } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  if (isNew === "true") filter.isNew = true;
  if (active !== undefined) filter.isActive = active === "true";
  if (search) filter.$text = { $search: search };

  let query = Product.find(filter).populate("category", "name nameAr slug");

  if (bestSellers === "true") {
    query = query.sort({ salesCount: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    query.skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    products,
  });
});

// @desc    منتج واحد بالـ slug أو الـ id
// @route   GET /api/products/:idOrSlug
const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const product = await Product.findOne({
    $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
  }).populate("category", "name nameAr slug");

  if (!product) {
    res.status(404);
    throw new Error("المنتج غير موجود");
  }

  // منتجات مشابهة (نفس التصنيف)
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4);

  res.json({ success: true, product, relatedProducts });
});

// @desc    إنشاء منتج جديد
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    تعديل منتج
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("المنتج غير موجود");
  }

  res.json({ success: true, product });
});

// @desc    حذف منتج
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("المنتج غير موجود");
  }
  res.json({ success: true, message: "تم حذف المنتج" });
});

// @desc    تعديل جماعي سريع (زي تفعيل/تعطيل أو تمييز عدة منتجات)
// @route   PATCH /api/products/bulk
const bulkUpdateProducts = asyncHandler(async (req, res) => {
  const { ids, update } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("لازم تبعت قائمة IDs");
  }
  await Product.updateMany({ _id: { $in: ids } }, { $set: update });
  res.json({ success: true, message: `تم تحديث ${ids.length} منتج` });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
};

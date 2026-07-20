const mongoose = require("mongoose");
const slugify = require("slugify");

const addonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true },
    slug: { type: String, unique: true },
    description: { type: String },
    ingredients: [{ type: String }], // المكونات
    images: [{ type: String }], // صور متعددة
    price: { type: Number, required: true },
    compareAtPrice: { type: Number }, // للعروض / الخصومات
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    addons: [addonSchema], // الإضافات
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true },

    isFeatured: { type: Boolean, default: false }, // منتجات مميزة
    isNew: { type: Boolean, default: false }, // منتجات جديدة
    salesCount: { type: Number, default: 0 }, // لحساب الأكثر مبيعًا

    isActive: { type: Boolean, default: true },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-5);
  }
  next();
});

productSchema.index({ name: "text", nameAr: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);

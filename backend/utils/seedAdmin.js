require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL });
    if (exists) {
      console.log("⚠️  السوبر أدمن موجود بالفعل:", exists.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: process.env.SEED_ADMIN_NAME || "Super Admin",
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      role: "superadmin",
      permissions: {
        products: true,
        orders: true,
        customers: true,
        coupons: true,
        reports: true,
      },
    });

    console.log("✅ تم إنشاء السوبر أدمن بنجاح:");
    console.log("   Email:", admin.email);
    console.log("   Password:", process.env.SEED_ADMIN_PASSWORD, "(غيّرها بعد أول دخول)");
    process.exit(0);
  } catch (error) {
    console.error("❌ خطأ:", error.message);
    process.exit(1);
  }
};

seedAdmin();

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// تأكيد إن المستخدم مسجل دخول بتوكن صالح
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user || !req.user.isActive) {
        res.status(401);
        throw new Error("غير مصرح لك، الحساب غير مفعل أو غير موجود");
      }

      return next();
    } catch (error) {
      res.status(401);
      throw new Error("غير مصرح لك، التوكن غير صالح");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("غير مصرح لك، مفيش توكن");
  }
});

// تحديد الأدوار المسموح لها بالوصول
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`دورك (${req.user?.role}) مش مسموح له بالوصول هنا`);
    }
    next();
  };
};

// صلاحية دقيقة على مستوى الموديول (products, orders, ...)
const hasPermission = (module) => {
  return (req, res, next) => {
    if (req.user.role === "superadmin") return next(); // السوبر أدمن له كل الصلاحيات
    if (!req.user.permissions?.[module]) {
      res.status(403);
      throw new Error("مفيش صلاحية لإدارة هذا القسم");
    }
    next();
  };
};

module.exports = { protect, authorize, hasPermission };

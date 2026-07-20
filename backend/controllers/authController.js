const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    تسجيل دخول الأدمن/الموظف
// @route   POST /api/auth/login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("الحساب غير مفعل، تواصل مع السوبر أدمن");
  }

  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
  });
});

// @desc    بيانات المستخدم الحالي
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc    إضافة موظف/أدمن جديد (سوبر أدمن بس)
// @route   POST /api/auth/users
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("البريد الإلكتروني ده مستخدم بالفعل");
  }

  const user = await User.create({ name, email, password, role, permissions });

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    عرض كل المستخدمين (موظفين/أدمن)
// @route   GET /api/auth/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, count: users.length, users });
});

// @desc    تحديث حالة/صلاحيات مستخدم
// @route   PUT /api/auth/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("المستخدم غير موجود");
  }

  const { name, role, permissions, isActive, password } = req.body;
  if (name) user.name = name;
  if (role) user.role = role;
  if (permissions) user.permissions = { ...user.permissions, ...permissions };
  if (typeof isActive === "boolean") user.isActive = isActive;
  if (password) user.password = password;

  await user.save();
  res.json({ success: true, message: "تم التحديث بنجاح" });
});

module.exports = { loginAdmin, getMe, createUser, getUsers, updateUser };

const express = require("express");
const router = express.Router();
const { loginAdmin, getMe, createUser, getUsers, updateUser } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", loginAdmin);
router.get("/me", protect, getMe);

// إدارة المستخدمين - سوبر أدمن بس
router.post("/users", protect, authorize("superadmin"), createUser);
router.get("/users", protect, authorize("superadmin", "admin"), getUsers);
router.put("/users/:id", protect, authorize("superadmin"), updateUser);

module.exports = router;

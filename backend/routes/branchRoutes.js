const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");
const { protect, hasPermission } = require("../middleware/auth");

router.get("/", asyncHandler(async (req, res) => {
  const branches = await Branch.find({ isActive: true });
  res.json({ success: true, branches });
}));

router.post("/", protect, hasPermission("products"), asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json({ success: true, branch });
}));

router.put("/:id", protect, hasPermission("products"), asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, branch });
}));

router.delete("/:id", protect, hasPermission("products"), asyncHandler(async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "تم حذف الفرع" });
}));

module.exports = router;

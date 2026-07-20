const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, hasPermission } = require("../middleware/auth");

router.get("/", getCategories);
router.post("/", protect, hasPermission("products"), createCategory);
router.put("/:id", protect, hasPermission("products"), updateCategory);
router.delete("/:id", protect, hasPermission("products"), deleteCategory);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
} = require("../controllers/productController");
const { protect, hasPermission } = require("../middleware/auth");

// عام - متاح للمتجر (بدون تسجيل دخول)
router.get("/", getProducts);
router.get("/:idOrSlug", getProduct);

// محمي - للوحة التحكم فقط
router.post("/", protect, hasPermission("products"), createProduct);
router.patch("/bulk", protect, hasPermission("products"), bulkUpdateProducts);
router.put("/:id", protect, hasPermission("products"), updateProduct);
router.delete("/:id", protect, hasPermission("products"), deleteProduct);

module.exports = router;

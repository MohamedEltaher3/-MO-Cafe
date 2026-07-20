const express = require("express");
const router = express.Router();
const { getOverview, getSalesByDay } = require("../controllers/reportController");
const { protect, hasPermission } = require("../middleware/auth");

router.get("/overview", protect, hasPermission("reports"), getOverview);
router.get("/sales-by-day", protect, hasPermission("reports"), getSalesByDay);

module.exports = router;

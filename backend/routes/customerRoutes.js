const express = require("express");
const router = express.Router();
const { getCustomers, getCustomer, updateCustomer } = require("../controllers/customerController");
const { protect, hasPermission } = require("../middleware/auth");

router.get("/", protect, hasPermission("customers"), getCustomers);
router.get("/:id", protect, hasPermission("customers"), getCustomer);
router.put("/:id", protect, hasPermission("customers"), updateCustomer);

module.exports = router;

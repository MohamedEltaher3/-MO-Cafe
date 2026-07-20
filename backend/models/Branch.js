const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameAr: { type: String },
    address: { type: String },
    phone: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    workingHours: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);

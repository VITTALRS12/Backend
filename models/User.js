const mongoose = require("mongoose");

// Address subdocument schema
const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true } // Important to have _id on subdocs for updates/deletes
);

// Main User schema
const userSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },

    passwordHash: { type: String, required: true },

    avatar: { type: String, default: "" },

    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    status: {
      type: String,
      enum: ["verified", "unverified", "banned"],
      default: "unverified",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    walletBalance: { type: Number, default: 0 },

    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: null },
    totalReferrals: { type: Number, default: 0 },

    contestsPlayed: { type: Number, default: 0 },
    contestsWon: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },

    tokens: [{ type: String }],

    isPaidUser: { type: Boolean, default: false },
    joinDate: { type: Date, default: Date.now },

    addresses: [addressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

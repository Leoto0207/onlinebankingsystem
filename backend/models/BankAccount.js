const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// connect to database for acc
const bankAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accNum: { type: String, required: true },
  balance: {
    type: Number,
    min: 0.0,
    default: 0.0,
    set: (val) => Math.round(val * 100) / 100,
    required: true,
  },
  accType: { type: String, required: true },
});

module.exports = mongoose.model("BankAccount", bankAccountSchema);

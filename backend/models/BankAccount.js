const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const bankAccountSchema = new mongoose.Schema({
  //for connect user data
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

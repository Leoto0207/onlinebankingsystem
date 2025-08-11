const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// bankAccountSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

module.exports = mongoose.model("BankAccount", bankAccountSchema);

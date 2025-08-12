const express = require("express");
const {
  getBankAccById,
  getBankAcc,
  addBankAcc,
  updateBankAcc,
  deleteBankAcc,
} = require("../controllers/bkAccController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getBankAcc).post(protect, addBankAcc);
router.route("/user").get(protect, getBankAccById);
router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc);
// router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc);
//   .get(protect, getAllAcc)
module.exports = router;

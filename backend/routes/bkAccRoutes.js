const express = require("express");
const {
  getBankAcc,
  addBankAcc,
  updateBankAcc,
  deleteBankAcc,
  getAllAcc,
} = require("../controllers/bkAccController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getBankAcc);
router.route("/admin").get(protect, getAllAcc).post(protect, addBankAcc);
router
  .route("/admin/:id")
  .put(protect, updateBankAcc)
  .delete(protect, deleteBankAcc);
// router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc);

module.exports = router;

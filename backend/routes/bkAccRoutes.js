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

router
  .route("/")
  .get(protect, getBankAcc)

  .post(protect, addBankAcc);
router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc);
// router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc);
//   .get(protect, getAllAcc)
module.exports = router;

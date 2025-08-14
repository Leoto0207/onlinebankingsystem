const express = require("express");
const {
  getBankAccByUserId,
  getBankAccByAccId,
  getBankAcc,
  addBankAcc,
  updateBankAcc,
  deleteBankAcc,
  updateBankAccByAccNum,
} = require("../controllers/bkAccController");
const {
  protect,
  createAccValidateInput,
} = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(protect, getBankAcc)
  .post(protect, createAccValidateInput, addBankAcc); // get info and add acc
router.route("/user").get(protect, getBankAccByUserId);
router.route("/getacc/:id").get(protect, getBankAccByAccId);
router.route("/updatebalance").put(protect, updateBankAccByAccNum);
router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc); //delete acc ,edit account
// router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc);
//   .get(protect, getAllAcc)
module.exports = router;

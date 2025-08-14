const express = require("express");
const {
  getTransHistByAccNum,
  addTransHist,
  updateTransHist,
  deleteTransHist,
} = require("../controllers/transController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, addTransHist); //add trans hist
router
  .route("/:id")
  .put(protect, updateTransHist)
  .delete(protect, deleteTransHist); // connect to database for delete and edit
router.route("/:accNum").get(protect, getTransHistByAccNum); //get trans hist by accnum

// router.route("/:id").put(protect, updateBankAcc).delete(protect, deleteBankAcc);
//   .get(protect, getAllAcc)
module.exports = router;

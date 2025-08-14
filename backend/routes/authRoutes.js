const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getProfile,
  getAllUsers,
} = require("../controllers/authController");
const {
  protect,
  signUpValidateInput,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", signUpValidateInput, registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/userlist", protect, getAllUsers);
router.put("/profile", protect, updateUserProfile);

module.exports = router;

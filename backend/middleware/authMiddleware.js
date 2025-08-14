const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

async function signUpValidateInput(req, res, next) {
  const { name, username, email, password, phoneNumber, address } = req.body;
  if (!name || !username || !email || !password || !phoneNumber || !address) {
    return res.status(400).json({
      error:
        "name, email, username, password, phone number and address are required",
    });
  }
  next();
}

module.exports = { protect, signUpValidateInput };

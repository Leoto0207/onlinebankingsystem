const BankAcc = require("../models/BankAccount");

const getBankAcc = async (req, res) => {
  try {
    const bankAcc = await BankAcc.find({ userId: req.user.id });
    res.json(bankAcc);
  } catch (error) {
    console.log("getBankAcc error");
    res.status(500).json({ message: error.message });
  }
};

const addBankAcc = async (req, res) => {
  const { userId, accNum, balance, accType } = req.body;
  try {
    const bankAcc = await BankAcc.create({
      userId: userId,
      accNum,
      balance,
      accType,
    });
    res.status(201).json(bankAcc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBankAcc = async (req, res) => {
  const { accNum, balance, accType } = req.body;
  try {
    const bankAcc = await BankAcc.findById(req.params.id);
    if (!bankAcc)
      return res.status(404).json({ message: "Bank account not found" });
    bankAcc.accNum = accNum || bankAcc.accNum;
    bankAcc.balance = balance || bankAcc.balance;
    bankAcc.accType = accType || bankAcc.accType;
    const updatedBankAcc = await bankAcc.save();
    res.json(updatedBankAcc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBankAcc = async (req, res) => {
  try {
    const bankAcc = await BankAcc.findById(req.params.id);
    if (!bankAcc)
      return res.status(404).json({ message: "Bank account not found" });
    await bankAcc.remove();
    res.json({ message: "Bank account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAcc = async (req, res) => {
  try {
    const allAcc = await BankAcc.find({});
    if (!allAcc) return [];
    res.json(allAcc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBankAcc,
  addBankAcc,
  updateBankAcc,
  deleteBankAcc,
  getAllAcc,
};

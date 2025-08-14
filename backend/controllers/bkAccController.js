const BankAcc = require("../models/BankAccount");

// retrieve acc info
const getBankAcc = async (req, res) => {
  try {
    const bankAcc = await BankAcc.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          accNum: 1,
          balance: 1,
          accType: 1,
          userName: "$userInfo.name",
        },
      },
    ]);
    res.status(201).json(bankAcc);
  } catch (error) {
    console.log("getBankAcc error");
    res.status(500).json({ message: error.message });
  }
};

const getBankAccByUserId = async (req, res) => {
  try {
    const bankAccById = await BankAcc.find({ userId: req.user.id });
    if (!bankAccById) return [];
    return res.json(bankAccById);
  } catch (error) {
    console.log("getBankAccByUserId has error");
    res.status(500).json({ message: error.message });
  }
};
//for transaction
const getBankAccByAccId = async (req, res) => {
  try {
    const bankAccById = await BankAcc.findById(req.params.id);
    if (!bankAccById) return [];
    console.log(`getBankAccByAccId ${bankAccById}`);
    return res.json(bankAccById);
  } catch (error) {
    console.log("getBankAccByAccId has error");
    res.status(500).json({ message: error.message });
  }
};
// add acc
const addBankAcc = async (req, res) => {
  const { userId, accNum, balance, accType } = req.body;
  try {
    const bankAcc = await BankAcc.create({
      userId,
      accNum,
      balance,
      accType,
    });

    const populatedBankAcc = await BankAcc.findById(bankAcc._id)
      .populate("userId", "name")
      .lean();

    res.status(201).json({
      ...populatedBankAcc,
      userName: populatedBankAcc.userId.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//update account function
const updateBankAcc = async (req, res) => {
  const { accNum, balance, accType } = req.body;
  try {
    const bankAcc = await BankAcc.findById(req.params.id);
    if (!bankAcc)
      return res.status(404).json({ message: "Bank account not found" });
    bankAcc.accNum = accNum || bankAcc.accNum;
    bankAcc.balance = balance || bankAcc.balance;
    bankAcc.accType = accType || bankAcc.accType;
    await bankAcc.save();
    const updatedBankAcc = await BankAcc.findById(bankAcc._id).populate(
      "userId",
      "name"
    );
    res.json({
      ...updatedBankAcc.toObject(),
      userName: updatedBankAcc.userId.name,
    });
    // const updatedBankAcc = await bankAcc.save();
    // res.json(updatedBankAcc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update bank account balance
const updateBankAccByAccNum = async (req, res) => {
  const { fromAccount, toAccount, amount, createdAt, status } = req.body;
  try {
    const fromBankAcc = await BankAcc.findOne({ accNum: fromAccount });
    const toBankAcc = await BankAcc.findOne({ accNum: toAccount });

    if (!fromBankAcc || !toBankAcc)
      return res.status(404).json({ message: "Bank account not found" });

    if (fromBankAcc.balance < amount) {
      return res.status(404).json({ message: "Account balance is not enough" });
    }
    // only update when status is success
    fromBankAcc.accNum = fromBankAcc.accNum;
    fromBankAcc.balance =
      status === "success" ? fromBankAcc.balance - amount : fromBankAcc.balance;
    fromBankAcc.accType = fromBankAcc.accType;
    toBankAcc.accNum = toBankAcc.accNum;
    toBankAcc.balance =
      status === "success" ? toBankAcc.balance + amount : toBankAcc.balance;
    toBankAcc.accType = toBankAcc.accType;
    await fromBankAcc.save();
    await toBankAcc.save();

    const updatedBankAcc = await BankAcc.findById(fromBankAcc._id).populate(
      "userId",
      "name"
    );
    res.json({
      ...updatedBankAcc.toObject(),
      userName: updatedBankAcc.userId.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete account function
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

module.exports = {
  getBankAcc,
  getBankAccByUserId,
  getBankAccByAccId,
  addBankAcc,
  updateBankAcc,
  deleteBankAcc,
  updateBankAccByAccNum,
};

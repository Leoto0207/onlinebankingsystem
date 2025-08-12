const BankAcc = require("../models/BankAccount");

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

const getBankAccById = async (req, res) => {
  try {
    const bankAccById = await BankAcc.find({ userId: req.user.id });
    if (!bankAccById) return [];
    return res.json(bankAccById);
  } catch (error) {
    console.log("getBankAccById has error");
    res.status(500).json({ message: error.message });
  }
};

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
//update account
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
//delete account
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

// const getAllAcc = async (req, res) => {
//   try {
//     const allAcc = await BankAcc.find({});
//     if (!allAcc) return [];
//     res.json(allAcc);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  getBankAcc,
  getBankAccById,
  addBankAcc,
  updateBankAcc,
  deleteBankAcc,
};

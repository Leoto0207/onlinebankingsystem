const TransHist = require("../models/TransHist");

const getTransHistByAccNum = async (req, res) => {
  const { accNum } = req.params;
  try {
    console.log("fromAccount", accNum);
    const transactions = await TransHist.find({
      $or: [{ fromAccount: accNum }, { toAccount: accNum }],
    }).sort({ createdAt: -1 }); // latest first
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const addTransHist = async (req, res) => {
  const {
    userId,
    fromAccount,
    toAccount,
    type,
    amount,
    currency,
    status,
    description,
    createdAt,
  } = req.body;
  try {
    console.log("start to save transhist");
    const transHist = await TransHist.create({
      userId,
      fromAccount,
      toAccount,
      type,
      amount,
      currency,
      status,
      description,
      createdAt,
    });
    res.status(201).json(transHist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update transaction history
const updateTransHist = async (req, res) => {
  const { description, status, amount } = req.body;
  try {
    const transHist = await TransHist.findById(req.params.id);
    if (!transHist)
      return res.status(404).json({ message: "TransHist not found" });
    transHist.description = description || task.description;
    transHist.status = status || transHist.status;
    transHist.amount = amount || transHist.amount;
    const updatedTransHist = await transHist.save();
    res.json(updatedTransHist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransHist = async (req, res) => {
  try {
    const transHist = await TransHist.findById(req.params.id);
    if (!transHist)
      return res.status(404).json({ message: "TransHist not found" });
    await transHist.remove();
    res.json({ message: "TransHist deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getTransHistByAccNum,
  addTransHist,
  updateTransHist,
  deleteTransHist,
};

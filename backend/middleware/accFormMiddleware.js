async function createAccValidateInput(req, res, next) {
  const { userId, accNum, balance, accType } = req.body;
  if (
    !userId ||
    !accNum ||
    accNum.length < 1 ||
    !balance ||
    !accType ||
    accType.length < 1
  ) {
    return res.status(400).json({
      error: "uesrId, accNum, balance and accType are required",
    });
  }
  next();
}

module.exports = { createAccValidateInput };

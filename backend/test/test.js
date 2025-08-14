const chai = require("chai");
const chaiHttp = require("chai-http");
const http = require("http");
const app = require("../server");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const sinon = require("sinon");
const BankAccModel = require("../models/BankAccount");
const TransHistModel = require("../models/TransHist");
const {
  getTransHistByAccNum,
  addTransHist,
  updateTransHist,
  deleteTransHist,
} = require("../controllers/transController");
const {
  getBankAcc,
  getBankAccByUserId,
  getBankAccByAccId,
  addBankAcc,
  updateBankAcc,
  updateBankAccByAccNum,
  deleteBankAcc,
} = require("../controllers/bkAccController");
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe("addBankAcc Function Test", () => {
  it("should create a new bank acc successfully", async () => {
    // Mock request data
    const userId = new mongoose.Types.ObjectId();
    const req = {
      body: {
        userId,
        accNum: "123123",
        balance: 100.0,
        accType: "Savings",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Mock acc that would be created
    const createdBankAcc = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    };

    const createStub = sinon
      .stub(BankAccModel, "create")
      .resolves(createdBankAcc);
    const leanStub = sinon
      .stub()
      .resolves({ ...createdBankAcc, userId: { name: "Peter" } });
    const populateStub = sinon.stub().returns({ lean: leanStub });
    const findByIdStub = sinon
      .stub(BankAccModel, "findById")
      .returns({ populate: populateStub });

    // Call function
    await addBankAcc(req, res);

    // Assertions
    expect(
      createStub.calledOnceWith({
        userId,
        accNum: "123123",
        balance: 100.0,
        accType: "Savings",
      })
    ).to.be.true;
    expect(findByIdStub.calledOnceWith(createdBankAcc._id)).to.be.true;
    expect(populateStub.calledOnceWith("userId", "name")).to.be.true;
    expect(leanStub.calledOnce).to.be.true;

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ userName: "Peter" })).to.be.true;
    // Mock response object

    // Restore stubbed methods
    createStub.restore();
    findByIdStub.restore();
  });

  it("should return 500 if an error occurs", async () => {
    // Stub Task.create to throw an error
    const createStub = sinon
      .stub(BankAccModel, "create")
      .throws(new Error("DB Error"));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        accNum: "123122",
        balance: 200.0,
        accType: "Premium",
      },
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call function
    await addBankAcc(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });
});
//#2
describe("Update Function Test", () => {
  it("should update bank acc successfully", async () => {
    // Mock task data
    const bankAccId = new mongoose.Types.ObjectId();
    const existingBankAcc = {
      _id: bankAccId,
      accNum: "123123",
      balance: 100.0,
      accType: "Savings",
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    const populatedBankAcc = {
      toObject: () => ({
        _id: bankAccId,
        accNum: "123123",
        balance: 50,
        accType: "Premium",
      }),
      userId: { name: "Peter" },
    };

    // Stub Task.findById to return mock task
    const findByIdStub = sinon.stub(BankAccModel, "findById");
    findByIdStub.onFirstCall().resolves(existingBankAcc);
    findByIdStub.onSecondCall().returns({
      populate: sinon.stub().returns(populatedBankAcc),
    });

    // Mock request & response
    const req = {
      params: { id: bankAccId },
      body: { balance: 50, accType: "Premium" },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    // Call function
    await updateBankAcc(req, res);

    // Assertions
    expect(existingBankAcc.balance).to.equal(50);
    expect(existingBankAcc.accType).to.equal("Premium");

    expect(findByIdStub.firstCall.calledWith(bankAccId)).to.be.true;
    expect(findByIdStub.secondCall.calledWith(bankAccId)).to.be.true;

    expect(res.status.called).to.be.false;
    expect(res.json.calledOnceWithMatch({ userName: "Peter" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it("should return 404 if task is not found", async () => {
    const findByIdStub = sinon.stub(BankAccModel, "findById").resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateBankAcc(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Bank account not found" })).to.be
      .true;

    findByIdStub.restore();
  });

  it("should return 500 on error", async () => {
    const findByIdStub = sinon
      .stub(BankAccModel, "findById")
      .throws(new Error("DB Error"));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateBankAcc(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });
});

describe("getBankAcc Function Test", () => {
  it("should return bank acc for the given user", async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();
    const accounts = [
      {
        _id: new mongoose.Types.ObjectId(),
        accNum: "111111",
        balance: 80,
        accType: "Savings",
        userName: "Peter",
        userId,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        accNum: "111112",
        balance: 90,
        accType: "Savings",
        userName: "Peter",
        userId,
      },
    ];
    const aggregateStub = sinon
      .stub(BankAccModel, "aggregate")
      .resolves(accounts);
    const req = { user: { id: userId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getBankAcc(req, res);

    expect(aggregateStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(accounts)).to.be.true;

    aggregateStub.restore();
  });

  it("should return 500 on error", async () => {
    const aggregateStub = sinon
      .stub(BankAccModel, "aggregate")
      .throws(new Error("DB Error"));
    const req = {};
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getBankAcc(req, res);
    const findStub = sinon
      .stub(BankAccModel, "find")
      .throws(new Error("DB Error"));

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });
});

describe("delete Function Test", () => {
  it("should delete an account successfully", async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock task found in the database
    const bankAcc = { remove: sinon.stub().resolves() };

    // Stub Task.findById to return the mock task
    const findByIdStub = sinon.stub(BankAccModel, "findById").resolves(bankAcc);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call function
    await deleteBankAcc(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(bankAcc.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: "Bank account deleted" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it("should return 404 if task is not found", async () => {
    // Stub Task.findById to return null
    const findByIdStub = sinon.stub(BankAccModel, "findById").resolves(null);
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Call function
    await deleteBankAcc(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Bank account not found" })).to.be
      .true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it("should return 500 if an error occurs", async () => {
    // Stub Task.findById to throw an error
    const findByIdStub = sinon
      .stub(BankAccModel, "findById")
      .throws(new Error("DB Error"));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call function
    await deleteBankAcc(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });
});

describe("getBankAccByUserId Function Test", () => {
  it("should return bank acc for the given user by userid", async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();
    const accounts = [
      {
        _id: new mongoose.Types.ObjectId(),
        accNum: "111111",
        balance: 80,
        accType: "Savings",
        userName: "Peter",
        userId,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        accNum: "111112",
        balance: 90,
        accType: "Savings",
        userName: "Peter",
        userId,
      },
    ];
    const findStub = sinon.stub(BankAccModel, "find").resolves(accounts);

    const req = { user: { id: userId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getBankAccByUserId(req, res);

    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(accounts)).to.be.true;

    findStub.restore();
  });

  it("should return 500 on error", async () => {
    const findStub = sinon
      .stub(BankAccModel, "find")
      .throws(new Error("DB Error"));

    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getBankAccByUserId(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;

    findStub.restore();
  });
});

describe("getBankAccByAccId Function Test", () => {
  it("should return bank account for the given accid", async () => {
    const bankAcc = {
      _id: new mongoose.Types.ObjectId(),
      accNum: "123123",
      balance: 100,
      accType: "Savings",
    };
    const findByIdStub = sinon.stub(BankAccModel, "findById").resolves(bankAcc);

    const req = { params: { id: bankAcc._id } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getBankAccByAccId(req, res);

    expect(findByIdStub.calledOnceWith(bankAcc._id)).to.be.true;
    expect(res.json.calledWith(bankAcc)).to.be.true;

    findByIdStub.restore();
  });

  it("no account should return empty array", async () => {
    const findByIdStub = sinon.stub(BankAccModel, "findById").resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getBankAccByAccId(req, res);

    // Controller returns [] if not found
    expect(findByIdStub.calledOnce).to.be.true;
    expect(res.json.calledWith([])).to.be.true;

    findByIdStub.restore();
  });

  it("should return 500 for error", async () => {
    const findStub = sinon
      .stub(BankAccModel, "findById")
      .throws(new Error("DB Error"));

    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getBankAccByAccId(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;

    findStub.restore();
  });
});

// transhist
describe("getTransHistByAccNum function", () => {
  it("should return transactions for given account number", async () => {
    const accNum = "123456";
    const transactions = [{ fromAccount: accNum }, { toAccount: accNum }];
    const sortStub = sinon.stub().resolves(transactions);
    const findByAccNumStub = sinon
      .stub(TransHistModel, "find")
      .returns({ sort: sortStub });

    const req = { params: { accNum } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getTransHistByAccNum(req, res);
    expect(
      findByAccNumStub.calledOnceWith({
        $or: [{ fromAccount: accNum }, { toAccount: accNum }],
      })
    ).to.be.true;
    expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(transactions)).to.be.true;

    findByAccNumStub.restore();
  });

  it("should return 500 on error", async () => {
    const sortStub = sinon.stub().throws(new Error("Server Error"));

    const findByAccNumStub = sinon
      .stub(TransHistModel, "find")
      .returns({ sort: sortStub });

    const req = { params: { accNum: "123123" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getTransHistByAccNum(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Server Error" })).to.be.true;

    findByAccNumStub.restore();
  });
});

describe("addTransHist", () => {
  it("should create a new transaction history", async () => {
    const transHistData = {
      fromAccount: "123123",
      toAccount: "111111",
      amount: 100,
    };
    const createdTransHist = {
      ...transHistData,
      _id: new mongoose.Types.ObjectId(),
    };
    const createStub = sinon
      .stub(TransHistModel, "create")
      .resolves(createdTransHist);

    const req = { body: transHistData };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await addTransHist(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTransHist)).to.be.true;

    createStub.restore();
  });

  it("should return 500 on error", async () => {
    sinon.stub(TransHistModel, "create").throws(new Error("DB Error"));

    const req = { body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await addTransHist(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
  });
});

describe("updateTransHist", () => {
  it("should update transaction history if found", async () => {
    const transHist = {
      description: "testing",
      status: "pending",
      amount: 50,
      save: sinon.stub().resolvesThis(),
    };
    const updateStub = sinon
      .stub(TransHistModel, "findById")
      .resolves(transHist);

    const req = {
      params: { id: "1" },
      body: { description: "New Testing", amount: 100 },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateTransHist(req, res);

    expect(transHist.description).to.equal("New Testing");
    expect(transHist.amount).to.equal(100);
    expect(res.json.calledWith(transHist)).to.be.true;

    updateStub.restore();
  });

  it("should return 404 if transaction not found", async () => {
    const findByIdStub = sinon.stub(TransHistModel, "findById").resolves(null);

    const req = { params: { id: "1" }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateTransHist(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "TransHist not found" })).to.be.true;

    findByIdStub.restore();
  });

  it("should return 500 on error", async () => {
    const findByIdStub = sinon
      .stub(TransHistModel, "findById")
      .throws(new Error("DB Error"));

    const req = { params: { id: "1" }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateTransHist(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    findByIdStub.restore();
  });
});

describe("deleteTransHist Test", () => {
  it("should delete an account successfully", async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock task found in the database
    const transHist = { remove: sinon.stub().resolves() };

    // Stub Task.findById to return the mock task
    const findByIdStub = sinon
      .stub(TransHistModel, "findById")
      .resolves(transHist);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call function
    await deleteTransHist(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(transHist.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: "TransHist deleted" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it("should return 404 if transactions is not found", async () => {
    // Stub Task.findById to return null
    const findByIdStub = sinon.stub(TransHistModel, "findById").resolves(null);
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Call function
    await deleteTransHist(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "TransHist not found" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });
});
// updateBankAccByAccNum
describe("updateBankAccByAccNum Function Test", () => {
  // Mock bank accounts
  let fromBankAcc, toBankAcc;

  beforeEach(() => {
    fromBankAcc = {
      _id: new mongoose.Types.ObjectId(),
      accNum: "111111",
      balance: 100,
      accType: "Savings",
      save: sinon.stub().resolvesThis(),
    };

    toBankAcc = {
      _id: new mongoose.Types.ObjectId(),
      accNum: "222222",
      balance: 50,
      accType: "Savings",
      save: sinon.stub().resolvesThis(),
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs after each test
  });

  it("should update balances successfully when status is success", async () => {
    const findOneStub = sinon.stub(BankAccModel, "findOne");
    findOneStub.onFirstCall().resolves(fromBankAcc);
    findOneStub.onSecondCall().resolves(toBankAcc);
    const findByIdStub = sinon.stub(BankAccModel, "findById").returns({
      populate: sinon
        .stub()
        .withArgs("userId", "name")
        .resolves({
          _id: fromBankAcc._id,
          accNum: fromBankAcc.accNum,
          balance: fromBankAcc.balance,
          accType: fromBankAcc.accType,
          userId: { name: "Peter" },
          toObject: function () {
            return {
              _id: this._id,
              accNum: this.accNum,
              balance: this.balance,
              accType: this.accType,
              userId: this.userId,
            };
          },
        }),
    });

    const req = {
      body: {
        fromAccount: "111111",
        toAccount: "222222",
        amount: 10,
        status: "success",
      },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateBankAccByAccNum(req, res);

    // Check balances updated correctly
    expect(fromBankAcc.balance).to.equal(90);
    expect(toBankAcc.balance).to.equal(60);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0].userName).to.equal("Peter");

    findOneStub.restore();
    findByIdStub.restore();
  });

  it("should not change balances if status is not success", async () => {
    const findOneStub = sinon.stub(BankAccModel, "findOne");
    findOneStub.onFirstCall().resolves(fromBankAcc);
    findOneStub.onSecondCall().resolves(toBankAcc);

    const findByIdStub = sinon.stub(BankAccModel, "findById").resolves({
      toObject: () => ({ ...fromBankAcc }),
      userId: { name: "Peter" },
    });

    const req = {
      body: {
        fromAccount: "111111",
        toAccount: "222222",
        amount: 200,
        status: "pending",
      },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateBankAccByAccNum(req, res);

    // Check balances unchanged
    expect(fromBankAcc.balance).to.equal(100);
    expect(toBankAcc.balance).to.equal(50);

    findOneStub.restore();
    findByIdStub.restore();
  });

  it("should return 404 if either account not found", async () => {
    const findOneStub = sinon.stub(BankAccModel, "findOne");
    findOneStub.onFirstCall().resolves(null);
    findOneStub.onSecondCall().resolves(toBankAcc);

    const req = {
      body: { fromAccount: "123123", toAccount: "222222", amount: 20 },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateBankAccByAccNum(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Bank account not found" })).to.be
      .true;

    findOneStub.restore();
  });

  it("should return 404 if insufficient balance", async () => {
    const findOneStub = sinon.stub(BankAccModel, "findOne");
    fromBankAcc.balance = 50;
    findOneStub.onFirstCall().resolves(fromBankAcc);
    findOneStub.onSecondCall().resolves(toBankAcc);

    const req = {
      body: { fromAccount: "111111", toAccount: "222222", amount: 200 },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateBankAccByAccNum(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Account balance is not enough" })).to
      .be.true;

    findOneStub.restore();
  });

  it("should return 500 if any DB error occurs", async () => {
    const findOneStub = sinon
      .stub(BankAccModel, "findOne")
      .throws(new Error("DB Error"));

    const req = {
      body: { fromAccount: "111111", toAccount: "222222", amount: 100 },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateBankAccByAccNum(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;

    findOneStub.restore();
  });
});

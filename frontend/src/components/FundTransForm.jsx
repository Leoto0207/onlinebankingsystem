import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const FundTransForm = ({
  bankAcc,
  transHist,
  setTransHist,
  editingTransHist,
  setEditingTransHist,
}) => {
  const transStatus = ["pending", "success", "failed"];
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    userId: user.id,
    fromAccount: bankAcc.accNum,
    toAccount: "",
    type: "transfer",
    amount: 0.0,
    status: "pending",
    currency: "AUD",
    description: "",
    createdAt: today,
  });

  useEffect(() => {
    if (editingTransHist) {
      console.log("editingTransHist", editingTransHist);
      setFormData({
        userId: user.id,
        fromAccount: editingTransHist.fromAccount,
        toAccount: editingTransHist.toAccount,
        type: editingTransHist.type,
        amount: editingTransHist.amount,
        status: editingTransHist.status,
        currency: editingTransHist.currency,
        description: editingTransHist.description,
        createdAt: editingTransHist.createdAt,
      });
    } else {
      setFormData({
        userId: user.id,
        fromAccount: bankAcc.accNum,
        toAccount: "",
        type: "transfer",
        amount: 0.0,
        status: "pending",
        currency: "AUD",
        description: "",
        createdAt: today,
      });
    }
  }, [editingTransHist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bankAcc) {
      setFormData((prev) => ({
        ...prev,
        amount: parseFloat(formData.amount),
        fromAccount: bankAcc.accNum,
      }));
    }
    if (formData.description.length > 20) {
      alert("Description only allow 20 words.");
      return;
    }
    if (!formData.toAccount || formData.amount <= 0) {
      alert("toAccount and amount fields are required");
      return;
    }
    try {
      if (editingTransHist) {
        const response = await axiosInstance.put(
          `/api/transactions/${editingTransHist._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const updateBankAccBalance = await axiosInstance.put(
          `/api/bkaccs/updatebalance`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log("updateBankAccBalance", updateBankAccBalance);
        setTransHist(
          transHist.map((t) =>
            t._id === response.data._id ? response.data : t
          )
        );
      } else {
        // validate balance
        if (formData.amount > bankAcc.balance) {
          alert("Account balance is not enough.");
          return;
        }
        console.log(formData);
        const { userId } = formData;
        if (!userId) {
          alert("Please choose a user to create a transaction.");
          return;
        }
        // add trans to database
        const response = await axiosInstance.post(
          "/api/transactions",
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setTransHist([...transHist, response.data]);
      }
      setEditingTransHist(null);
      setFormData({
        userId: user.id,
        fromAccount: bankAcc.accNum,
        toAccount: "",
        type: "transfer",
        amount: 0.0,
        status: "pending",
        currency: "AUD",
        description: "",
        createdAt: today,
      });
    } catch (error) {
      alert("Failed to save transaction history.");
    }
  };
  // form for creating transaction
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded mb-6 max-w-md mx-auto mt-20"
    >
      <h1 className="text-2xl font-bold mb-4">
        {editingTransHist ? "Edit Transaction" : "Fund Transaction"}
      </h1>
      <label id="accFrom" className="font-bold" htmlFor="accFrom"></label>
      {editingTransHist && (
        <select
          value={formData.status || ""}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">-- Choose status --</option>
          {transStatus.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      {editingTransHist && (
        <input
          type="text"
          readOnly
          value={editingTransHist.fromAccount}
          className="w-full mb-4 p-2 border rounded"
        />
      )}
      {!editingTransHist && (
        <select
          disabled={editingTransHist}
          value={formData.fromAccount || ""}
          onChange={(e) =>
            setFormData({ ...formData, fromAccount: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">-- Choose a user --</option>

          <option key={bankAcc._id} value={bankAcc.accNum}>
            {bankAcc.accNum}
          </option>
        </select>
      )}

      <label id="accTo" className="font-bold" htmlFor="accTo">
        To Account:
      </label>
      {!editingTransHist && (
        <input
          readOnly={editingTransHist}
          id="accTo"
          type="text"
          value={formData.toAccount}
          placeholder="Account To"
          onChange={(e) =>
            setFormData({ ...formData, toAccount: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
        />
      )}
      <label id="curr" className="font-bold" htmlFor="curr">
        Currency:
      </label>
      <input
        type="text"
        readOnly
        value={formData.currency}
        className="w-full mb-4 p-2 border rounded"
      />
      <label id="amount" className="font-bold" htmlFor="amount">
        Amount:
      </label>
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) =>
          setFormData({ ...formData, amount: parseFloat(e.target.value) })
        }
        className="w-full mb-4 p-2 border rounded"
      />
      <label id="description" className="font-bold" htmlFor="description">
        Description:
      </label>
      <input
        type="text"
        value={formData.description}
        placeholder="Description"
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-bankDark text-white p-2 rounded"
      >
        {editingTransHist ? "Edit Transaction" : "Create Fund Transaction"}
      </button>
    </form>
  );
};

export default FundTransForm;

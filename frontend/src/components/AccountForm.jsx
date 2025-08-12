import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const AccountForm = ({
  bankAcc,
  setBankAcc,
  editingBankAcc,
  setEditingBankAcc,
}) => {
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    userId: null,
    accNum: "",
    balance: 0.0,
    accType: "",
  });

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/userList", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("fetchUserList", response.data);
        setUserList(response.data);
      } catch (error) {
        alert("failed to get user list.");
      }
    };
    fetchUserList();
  }, []);
  useEffect(() => {
    if (editingBankAcc) {
      setFormData({
        accNum: editingBankAcc.accNum,
        balance: editingBankAcc.balance,
        accType: editingBankAcc.accType,
        userId: editingBankAcc.userId,
      });
    } else {
      setFormData({ accNum: "", balance: 0.0, accType: "", userId: null });
    }
  }, [editingBankAcc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBankAcc) {
        const response = await axiosInstance.put(
          `/api/bkaccs/${editingBankAcc._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setBankAcc(
          bankAcc.map((acc) =>
            acc._id === response.data._id ? response.data : acc
          )
        );
      } else {
        const { userId } = formData;
        if (!userId) {
          alert("Please choose a user to create an account.");
          return;
        }
        const response = await axiosInstance.post("/api/bkaccs", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBankAcc([...bankAcc, response.data]);
      }
      setEditingBankAcc(null);
      setFormData({ accNum: "", accType: "", balance: 0.0, userId: "" });
    } catch (error) {
      alert("Failed to save bank account.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded mb-6"
    >
      <h1 className="text-2xl font-bold mb-4">
        {editingBankAcc ? "Edit Account" : "Create Account"}
      </h1>
      <select
        value={formData.userId || ""}
        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">-- Choose a user --</option>
        {userList.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Account Number"
        value={formData.accNum}
        onChange={(e) => setFormData({ ...formData, accNum: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Balance"
        value={formData.balance}
        onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={formData.accType}
        placeholder="Account Type"
        onChange={(e) => setFormData({ ...formData, accType: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {editingBankAcc ? "Update Button" : "Create Button"}
      </button>
    </form>
  );
};

export default AccountForm;

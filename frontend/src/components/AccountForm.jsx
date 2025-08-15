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
  }, [user.token]);
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
  // to create account
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBankAcc) {
        // edit acc
        const response = await axiosInstance.put(
          `/api/bkaccs/${editingBankAcc._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!response) return setBankAcc(bankAcc);
        setBankAcc(
          bankAcc.map((acc) =>
            acc._id === response.data._id ? response.data : acc
          )
        );
      } else {
        const { userId } = formData;
        if (!userId) {
          alert("You have to choose a user");
          return;
        }
        // create acc route
        const response = await axiosInstance.post("/api/bkaccs", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBankAcc([...bankAcc, response.data]);
      }
      setEditingBankAcc(null);
      setFormData({ accNum: "", accType: "", balance: 0.0, userId: "" });
    } catch (error) {
      // error handling
      if (error.status === 400 && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to save bank account.");
      }
    }
  };
  // form to create acc
  // only type input is available in edit
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded mb-6"
    >
      <h1 className="text-2xl font-bold mb-4">
        {editingBankAcc ? "Edit Account" : "Create Account"}
      </h1>
      {editingBankAcc && (
        <input
          type="text"
          readOnly
          value={editingBankAcc.userName}
          onChange={(e) => setFormData({ ...formData, accNum: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
      )}
      {!editingBankAcc && (
        <select
          disabled={editingBankAcc}
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
      )}

      <input
        type="text"
        readOnly={editingBankAcc}
        placeholder="Account Number"
        value={formData.accNum}
        onChange={(e) => setFormData({ ...formData, accNum: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        readOnly={editingBankAcc}
        placeholder="Balance"
        value={formData.balance}
        onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      {/* account type for user */}
      <input
        type="text"
        value={formData.accType}
        placeholder="Account Type"
        onChange={(e) => setFormData({ ...formData, accType: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-bankDark text-white p-2 rounded"
      >
        {editingBankAcc ? "Update Account" : "Create Account"}
      </button>
    </form>
  );
};

export default AccountForm;

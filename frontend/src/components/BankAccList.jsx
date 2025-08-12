import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const BankAccList = ({ bankAcc, setBankAcc, setEditingBankAcc }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("in bankacclist:", bankAcc);
  const handleDelete = async (accId) => {
    try {
      //server route to delete account
      await axiosInstance.delete(`/api/bkaccs/${accId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBankAcc(bankAcc.filter((acc) => acc._id !== accId));
    } catch (error) {
      alert("Failed to delete task.");
    }
  };
  const handleViewTransactions = (accId) => {
    navigate(`/transhist/${accId}`);
  };

  // show updated account list
  return (
    <div>
      {bankAcc.map((acc) => (
        <div key={acc._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          {user.role === "1" && (
            <h1 className="font-bold">User Name: {acc.userName}</h1>
          )}
          <h2 className="font-bold">Account Number: {acc.accNum}</h2>
          <p>{acc.accType}</p>
          <p className="text-sm text-gray-500">
            Balance: ${acc.balance.toFixed(2)}
          </p>
          <div className="mt-2">
            {user.role === "1" && (
              <button
                onClick={() => setEditingBankAcc(acc)}
                className="mr-2 bg-bankDark text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
            {user.role === "1" && (
              <button
                onClick={() => handleDelete(acc._id)}
                className="mr-2 bg-bankRed text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            )}

            <button
              onClick={() => handleViewTransactions(acc._id)}
              className="bg-bankDark text-white px-4 py-2 rounded"
            >
              View Transaction History
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BankAccList;

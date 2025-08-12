import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const BankAccList = ({ bankAcc, setBankAcc, setEditingBankAcc }) => {
  const { user } = useAuth();
  console.log("in bankacclist:", bankAcc);
  const handleDelete = async (accId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${accId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBankAcc(bankAcc.filter((acc) => acc._id !== accId));
    } catch (error) {
      alert("Failed to delete task.");
    }
  };

  return (
    <div>
      {bankAcc.map((acc) => (
        <div key={acc._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h1 className="font-bold">{acc.userName}</h1>
          <h2 className="font-bold">{acc.accNum}</h2>
          <p>{acc.accType}</p>
          <p className="text-sm text-gray-500">{acc.balance}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingBankAcc(acc)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(acc._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BankAccList;

import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const TransHistList = ({ transHist, setTransHist, setEditingTransHist }) => {
  const { user } = useAuth();
  console.log("in transHistList:", transHist);
  // delete trans hist route
  const handleDelete = async (transId) => {
    try {
      await axiosInstance.delete(`/api/transactions/${transId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTransHist(transHist.filter((t) => t._id !== transId));
    } catch (error) {
      alert("Failed to delete transaction history.");
    }
  };
  // show updated trans hist list
  return (
    <div className="overflow-x-auto mx-4 md:mx-16 mb-20">
      <h1 className="text-2xl font-bold mb-4 mt-3 text-center">
        Transactions History
      </h1>
      <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-gray-600">FromAccount</th>
            <th className="px-4 py-2 text-left text-gray-600">ToAccount</th>
            <th className="px-4 py-2 text-left text-gray-600">Description</th>
            <th className="px-4 py-2 text-left text-gray-600">Amount</th>
            <th className="px-4 py-2 text-left text-gray-600">Status</th>
            {user.role === "1" && (
              <th className="px-4 py-2 text-left text-gray-600">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transHist.length > 0 &&
            transHist.map((t) => (
              <tr key={t._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {new Date(t.createdAt).toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-2">{t.fromAccount}</td>
                <td className="px-4 py-2">{t.toAccount}</td>
                <td className="px-4 py-2">{t.description}</td>
                <td className="px-4 py-2">
                  {t.currency} {t.amount}
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    t.status === "success"
                      ? "text-green-600"
                      : t.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {t.status}
                </td>
                {user.role === "1" && t.status !== "success" && (
                  <td>
                    <button
                      onClick={() => setEditingTransHist(t)}
                      className="mr-2 bg-bankDark text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="mr-2 bg-bankRed text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransHistList;

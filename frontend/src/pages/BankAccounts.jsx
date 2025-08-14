import AccountForm from "../components/AccountForm";
import BankAccList from "../components/BankAccList";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const BankAccounts = () => {
  const { user } = useAuth();
  const [bankAcc, setBankAcc] = useState([]);
  const [editingBankAcc, setEditingBankAcc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchBankAccounts = async () => {
      try {
        const api = user.role === "1" ? "/api/bkaccs" : `/api/bkaccs/user`;
        const response = await axiosInstance.get(api, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBankAcc(response.data);
      } catch (error) {
        alert("Failed to fetch bank account.");
      } finally {
        setLoading(false);
      }
    };
    fetchBankAccounts();
    console.log("fetchBankAccounts", bankAcc);
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <button type="button" class="bg-indigo-500 ..." disabled>
          <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
          Loading...
        </button>
      </div>
    );
  }

  return (
    // only admin can access form function
    <div className="container mx-auto p-6">
      {user.role === "1" && (
        <AccountForm
          bankAcc={bankAcc}
          setBankAcc={setBankAcc}
          editingBankAcc={editingBankAcc}
          setEditingBankAcc={setEditingBankAcc}
        />
      )}
      {/* view account */}
      {!loading && (
        <BankAccList
          bankAcc={bankAcc}
          setBankAcc={setBankAcc}
          setEditingBankAcc={setEditingBankAcc}
        />
      )}
    </div>
  );
};

export default BankAccounts;

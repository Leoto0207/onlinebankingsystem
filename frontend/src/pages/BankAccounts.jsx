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
        const response = await axiosInstance.get("/api/bkaccs", {
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

  return (
    <div className="container mx-auto p-6">
      <AccountForm
        bankAcc={bankAcc}
        setBankAcc={setBankAcc}
        editingBankAcc={editingBankAcc}
        setEditingBankAcc={setEditingBankAcc}
      />
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

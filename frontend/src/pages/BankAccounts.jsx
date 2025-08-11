import AccountForm from "../components/AccountForm";
import BankAccList from "../components/BankAccList";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const BankAccounts = () => {
  const { user } = useAuth();
  const [bankAcc, setBankAcc] = useState([]);
  const [editingBankAcc, setEditingBankAcc] = useState(null);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await axiosInstance.get("/api/bkaccs", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBankAcc(response.data);
      } catch (error) {
        alert("Failed to fetch bank account.");
      }
    };

    fetchBankAccounts();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <AccountForm
        bankAcc={bankAcc}
        setBankAcc={setBankAcc}
        editingBankAcc={editingBankAcc}
        setEditingBankAcc={setEditingBankAcc}
      />
      <BankAccList
        bankAcc={bankAcc}
        setBankAcc={setBankAcc}
        setEditingBankAcc={setEditingBankAcc}
      />
    </div>
  );
};

export default BankAccounts;

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { useParams } from "react-router-dom";
import FundTransForm from "../components/FundTransForm";
import TransHistList from "../components/TransHistList";

const TransHist = () => {
  const { user } = useAuth();
  const { accId } = useParams();
  const [bankAcc, setBankAcc] = useState([]);
  const [editingTransHist, setEditingTransHist] = useState(null);
  const [transHist, setTransHist] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchAccountByAccId = async () => {
      setLoading(true);

      try {
        const accResponse = await axiosInstance.get(
          `/api/bkaccs/getacc/${accId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log("TransHist", accResponse);
        if (!accResponse) return setBankAcc({});
        setBankAcc(accResponse.data);
        let accNum = accResponse.data.accNum;
        const transResponse = await axiosInstance.get(
          `/api/transactions/${accNum}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log(transResponse);
        if (!transResponse) return setTransHist([]);
        setTransHist(transResponse.data);
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountByAccId();
  }, [accId, user.token]);

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
    <div>
      <FundTransForm
        bankAcc={bankAcc}
        transHist={transHist}
        setTransHist={setTransHist}
        editingTransHist={editingTransHist}
        setEditingTransHist={setEditingTransHist}
      />
      <TransHistList
        transHist={transHist}
        setTransHist={setTransHist}
        setEditingTransHist={setEditingTransHist}
      />
    </div>
  );
};

export default TransHist;

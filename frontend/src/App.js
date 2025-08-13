import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Index from "./pages/Index";
import BankAccounts from "./pages/BankAccounts";
import TransHist from "./pages/TransHist";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/accounts" element={<BankAccounts />} />
        <Route path="/transhist/:accId" element={<TransHist />} />
      </Routes>
    </Router>
  );
}

export default App;

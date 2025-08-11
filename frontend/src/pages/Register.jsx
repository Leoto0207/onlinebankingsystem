import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Register = () => {
  let [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    role: "0",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("form data", formData);
      await axiosInstance.post("/api/auth/register", formData);
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      const { response } = error;
      if (response.data.error) {
        setErrorMsg(response.data.error);
      } else {
        setErrorMsg(response.data.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="relative">
        {errorMsg && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-3 rounded shadow-lg">
            <p>{errorMsg}</p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-4xl font-bold mb-4 text-center">Register</h1>
        <label id="name" className="font-bold" htmlFor="name">
          Name:
        </label>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded border-bankDark"
        />
        <label id="username" className="font-bold" htmlFor="username">
          Username:
        </label>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded border-bankDark"
        />
        <label id="email" className="font-bold" htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded border-bankDark"
        />
        <label id="password" className="font-bold" htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded border-bankDark"
        />
        <label id="phoneNumber" className="font-bold" htmlFor="phoneNumber">
          Phone Number:
        </label>
        <input
          type="text"
          placeholder="Phone number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded border-bankDark"
        />
        <label id="address" className="font-bold" htmlFor="address">
          Address:
        </label>
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded border-bankDark"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

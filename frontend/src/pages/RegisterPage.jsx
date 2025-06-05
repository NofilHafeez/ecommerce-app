import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const { setUser, fetchUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, credentials, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage({ type: "success", text: response.data.success[0] });

        await fetchUser();

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error registering:", error);
      if (error.response?.data?.flash) {
        setMessage({ type: "error", text: error.response.data.flash[0] });
      } else {
        setMessage({ type: "error", text: "Something went wrong, please try again" });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ededed] p-4 relative">
      {/* Flash Message */}
      {message && (
        <div
          className={`fixed top-4 px-4 py-2 rounded text-white z-50 shadow-lg ${
            message.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="w-full max-w-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={credentials.name}
            onChange={handleChange}
            required
            className="p-3 border border-black rounded-lg outline-none focus:border-gray-700"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={credentials.email}
            onChange={handleChange}
            required
            className="p-3 border border-black rounded-lg outline-none focus:border-gray-700"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="p-3 border border-black rounded-lg outline-none focus:border-gray-700"
          />
          <button
            type="submit"
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all"
          >
            Register
          </button>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              className="text-black font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/login-page")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

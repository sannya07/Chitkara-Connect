import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import chitkaraLogo from "../../assets/chitkaraLogo.jpeg"; // Adjust the path as needed

const LoginPage = () => {
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before attempting login

    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: rollNo, password }), // Sending rollNo as userId
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        return;
      }

      const data = await response.json();

      // Ensure the token is received and store it in localStorage
      if (data.token) {
        localStorage.setItem("jwtToken", data.token); // Save token to localStorage
        console.log("Token saved in localStorage:", data.token);

        // Redirect based on the role
        if (data.role === "student") {
          navigate(`/student/home`);
        } else if (data.role === "teacher") {
          navigate(`/teacher/home`);
        } else if (data.role === "admin") {
          navigate(`/admin/home`);
        } else {
          setError("User role not found.");
        }
      } else {
        setError("No token received from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center space-x-2">
          <img src={chitkaraLogo} alt="Chitkara Logo" className="w-20 h-20 rounded-md" />
          <h1 className="text-3xl font-semibold text-gray-200">Chitkara Connect</h1>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="userid" className="block text-sm font-medium text-gray-400">
              User ID
            </label>
            <input
              type="number"
              id="userid"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="User ID"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        <div className="text-sm text-center text-gray-500">
          <p>Having trouble logging in?</p>
          <a href="/support" className="text-red-500 hover:underline">
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

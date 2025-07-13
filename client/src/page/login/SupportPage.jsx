import React, { useState } from "react";
import axios from "axios"; // Import axios for making API requests
import chitkaraLogo from "../../assets/chitkaraLogo.jpeg"; // Adjust the path as needed

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student", // Default role
    queryType: "Bug Report", // Default query type
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state to handle errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/support-add`, formData);
      console.log("Response:", response.data);
      setSuccessMessage("Thank you for your feedback! We'll get back to you shortly.");
      setErrorMessage(""); // Clear any previous error messages
      setFormData({
        name: "",
        email: "",
        role: "Student",
        queryType: "Bug Report",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Failed to submit feedback. Please try again later.");
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center space-x-2">
          <img src={chitkaraLogo} alt="Chitkara Logo" className="w-20 h-20 rounded-md" />
          <h1 className="text-3xl font-semibold text-gray-200">Support</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-400">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label htmlFor="queryType" className="block text-sm font-medium text-gray-400">
              Query Type
            </label>
            <select
              id="queryType"
              name="queryType"
              value={formData.queryType}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Bug Report">Bug Report</option>
              <option value="Query">Query</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-400">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your issue or query"
              rows="4"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            ></textarea>
          </div>

          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>

        <div className="text-sm text-center text-gray-500">
          <p>Need immediate help?</p>
          <a href="/" className="text-red-500 hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

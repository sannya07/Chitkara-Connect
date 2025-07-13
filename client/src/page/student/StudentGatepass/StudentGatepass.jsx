import React, { useState, useEffect } from "react";

const StudentGatepass = () => {
  const [activeTab, setActiveTab] = useState("applyForGatepass");
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    contact: "", // This will store the phone number
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [studentData, setStudentData] = useState({ name: "", email: "", rollNo: "", contact: "" });
  const [appliedGatepasses, setAppliedGatepasses] = useState([]);
  const [approvedGatepasses, setApprovedGatepasses] = useState([]);
  const [rejectedGatepasses, setRejectedGatepasses] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      // First, fetch the user details from the token
      fetch(`${apiBaseUrl}/api/post-data-from-token/${token}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          const { RollNo } = data.decoded;

          // Fetch the student details using the RollNo
          return fetch(`${apiBaseUrl}/api/student-details/${RollNo}`);
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching student details");
          }
          return response.json();
        })
        .then((data) => {
          const { name, email, RollNo, phoneNo } = data;
          setStudentData({ name, email, rollNo: RollNo, contact: phoneNo });
          setFormData({
            name,
            email,
            rollNo: RollNo,
            contact: phoneNo,
            date: "",
            time: "",
            reason: "",
          });

          // Now that we have the student details, fetch the pending, approved, and rejected gatepasses
          return RollNo;
        })
        .then((RollNo) => {
          // Fetch pending gatepasses for the student
          return fetch(`${apiBaseUrl}/api/gatepasses/pending/${RollNo}`);
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching pending gatepasses");
          }
          return response.json();
        })
        .then((data) => {
          setAppliedGatepasses(data);
        })
        .catch((error) => {
          console.error("Error fetching pending gatepasses:", error);
          setAppliedGatepasses([]); // Reset to an empty array in case of error
        });

      // Fetch approved gatepasses after fetching student data
      fetch(`${apiBaseUrl}/api/gatepasses/approved/${studentData.rollNo}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching approved gatepasses");
          }
          return response.json();
        })
        .then((data) => {
          setApprovedGatepasses(data);
        })
        .catch((error) => {
          console.error("Error fetching approved gatepasses:", error);
          setApprovedGatepasses([]); // Reset to empty array in case of error
        });

      // Fetch rejected gatepasses after fetching student data
      fetch(`${apiBaseUrl}/api/gatepasses/rejected/${studentData.rollNo}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching rejected gatepasses");
          }
          return response.json();
        })
        .then((data) => {
          setRejectedGatepasses(data);
        })
        .catch((error) => {
          console.error("Error fetching rejected gatepasses:", error);
          setRejectedGatepasses([]); // Reset to empty array in case of error
        });
    }
  }, [studentData.rollNo , activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/submit-gatepass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          approvedStatus: "pending",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage("Gate pass submitted successfully!");
        setFormData({
          ...studentData, // Reset the uneditable fields
          contact: studentData.contact, // Ensure contact remains unchanged
          date: "",
          time: "",
          reason: "",
        });
      } else {
        setResponseMessage(data.message || "Failed to submit gate pass.");
      }
    } catch (error) {
      setResponseMessage("Error submitting gate pass.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "applyForGatepass":
        return (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-200">Apply for Gate Pass</h2>

            {/* Name (Uneditable) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                readOnly
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-600 rounded-lg focus:outline-none"
              />
            </div>

            {/* Roll Number (Uneditable) */}
            <div>
              <label htmlFor="rollNo" className="block text-sm font-medium text-gray-400">Roll No</label>
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                value={formData.rollNo}
                readOnly
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-600 rounded-lg focus:outline-none"
              />
            </div>

            {/* Email (Uneditable) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-600 rounded-lg focus:outline-none"
              />
            </div>

            {/* Contact Number (Uneditable) */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-400">Contact Number</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                readOnly
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-600 rounded-lg focus:outline-none"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-400">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-400">Reason</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter the reason for the gate pass"
                className="w-full h-32 px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        );
        case "appliedGatepass":
  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-4">Applied Gate Pass</h2>

      {appliedGatepasses.length > 0 ? (
        <ul className="space-y-4">
          {appliedGatepasses.map((gatepass) => (
            <li
              key={gatepass._id}
              className="bg-gray-800 p-6  rounded-lg shadow-md border-2 border-yellow-500 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-2xl font-semibold">{gatepass.name}</h3>
                <span className="text-gray-400 text-sm">Gatepass ID: {gatepass._id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <p><strong>Roll No:</strong> {gatepass.rollNo}</p>
                <p><strong>Email:</strong> {gatepass.email}</p>
                <p><strong>Contact:</strong> {gatepass.contact}</p>
                <p><strong>Date:</strong> {gatepass.date}</p>
                <p><strong>Time:</strong> {gatepass.time}</p>
                <p><strong>Reason:</strong> {gatepass.reason}</p>
                <p><strong>Status: </strong> 
                  <span className={`font-bold uppercase ${gatepass.approvedStatus === 'approved' ? 'text-green-500' : gatepass.approvedStatus === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {gatepass.approvedStatus}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">You have no applied gate passes.</p>
      )}
    </div>
  );

case "approvedGatepass":
  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-4">Approved Gate Pass</h2>

      {approvedGatepasses.length > 0 ? (
        <ul className="space-y-4">
          {approvedGatepasses.map((gatepass) => (
            <li
              key={gatepass._id}
              className="bg-gray-800 p-6 rounded-lg shadow-md border-2 border-green-500 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-2xl font-semibold">{gatepass.name}</h3>
                <span className="text-gray-400 text-sm">Gatepass ID: {gatepass._id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <p><strong>Roll No:</strong> {gatepass.rollNo}</p>
                <p><strong>Email:</strong> {gatepass.email}</p>
                <p><strong>Contact:</strong> {gatepass.contact}</p>
                <p><strong>Date:</strong> {gatepass.date}</p>
                <p><strong>Time:</strong> {gatepass.time}</p>
                <p><strong>Reason:</strong> {gatepass.reason}</p>
                <p><strong>Status: </strong> 
                  <span className="font-bold uppercase text-green-500">{gatepass.approvedStatus}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">You have no approved gate passes.</p>
      )}
    </div>
  );

case "rejectedGatepass":
  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-4">Rejected Gate Pass</h2>

      {rejectedGatepasses && rejectedGatepasses.length > 0 ? (
        <ul className="space-y-4">
          {rejectedGatepasses.map((gatepass) => (
            <li
              key={gatepass._id}
              className="bg-gray-800 p-6 rounded-lg shadow-md border-2 border-red-500 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-2xl font-semibold">{gatepass.name}</h3>
                <span className="text-gray-400 text-sm">Gatepass ID: {gatepass._id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <p><strong>Roll No:</strong> {gatepass.rollNo}</p>
                <p><strong>Email:</strong> {gatepass.email}</p>
                <p><strong>Contact:</strong> {gatepass.contact}</p>
                <p><strong>Date:</strong> {gatepass.date}</p>
                <p><strong>Time:</strong> {gatepass.time}</p>
                <p><strong>Reason:</strong> {gatepass.reason}</p>
                <p><strong>Status: </strong> 
                  <span className="font-bold uppercase text-red-500">{gatepass.approvedStatus}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">You have no rejected gate passes.</p>
      )}
    </div>
  );



        default:
          return <p className="text-gray-200">Select a tab to view content.</p>;
      }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Small Navbar */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="flex flex-wrap justify-center space-x-2 md:space-x-8">
          <button
            onClick={() => setActiveTab("applyForGatepass")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "applyForGatepass"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Apply for Gate Pass
          </button>
          <button
            onClick={() => setActiveTab("appliedGatepass")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "appliedGatepass"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Applied Gate Pass
          </button>
          <button
            onClick={() => setActiveTab("approvedGatepass")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "approvedGatepass"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Approved Gate Pass
          </button>
          <button
            onClick={() => setActiveTab("rejectedGatepass")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "rejectedGatepass"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Rejected Gate Pass
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="p-4 md:p-8">
        {renderContent()}
        {responseMessage && <p className="text-center text-gray-300 mt-4">{responseMessage}</p>}
      </div>
    </div>
  );
};

export default StudentGatepass;

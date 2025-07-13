import React, { useState, useEffect } from "react";

const TeacherGatepass = () => {
    const [activeTab, setActiveTab] = useState("gatepass");
    const [pendingGatepasses, setPendingGatepasses] = useState([]);
    const [approvedGatepasses, setApprovedGatepasses] = useState([]);
    const [rejectedGatepasses, setRejectedGatepasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    useEffect(() => {
      const fetchGatepasses = async () => {
        try {
          const pendingResponse = await fetch(`${apiBaseUrl}/api/gatepasses/pending`);
          const approvedResponse = await fetch(`${apiBaseUrl}/api/gatepasses/approved`);
          const rejectedResponse = await fetch(`${apiBaseUrl}/api/gatepasses/rejected`);
  
          if (pendingResponse.ok) {
            const pendingData = await pendingResponse.json();
            setPendingGatepasses(Array.isArray(pendingData) ? pendingData : []);
          }
          if (approvedResponse.ok) {
            const approvedData = await approvedResponse.json();
            setApprovedGatepasses(Array.isArray(approvedData) ? approvedData : []);
          }
          if (rejectedResponse.ok) {
            const rejectedData = await rejectedResponse.json();
            setRejectedGatepasses(Array.isArray(rejectedData) ? rejectedData : []);
          }
        } catch (error) {
          console.error("Error fetching gatepasses:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchGatepasses();
    }, []);
  
    const updateGatepassStatus = async (id, status) => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/gatepasses/update-status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gatepassId: id,
            approvedStatus: status,
          }),
        });
  
        if (response.ok) {
          const updatedGatepass = await response.json();
  
          setPendingGatepasses(pendingGatepasses.filter((gatepass) => gatepass._id !== id));
  
          if (status === "approved") {
            setApprovedGatepasses([...approvedGatepasses, updatedGatepass]);
          } else if (status === "rejected") {
            setRejectedGatepasses([...rejectedGatepasses, updatedGatepass]);
          }
        } else {
          alert("Error: Unable to update gatepass status");
        }
      } catch (error) {
        console.error("Error updating gatepass status:", error);
        alert(`Error: ${error.message}`);
      }
    };
    const renderGatepassList = (gatepasses) => {
        if (!Array.isArray(gatepasses) || gatepasses.length === 0) {
          return <p className="text-gray-500">No gatepasses to display.</p>;
        }
      
        return (
          <ul>
            {gatepasses.map((gatepass) => (
              <li key={gatepass._id} className="p-4 mb-4 bg-gray-700 rounded-lg shadow-xl ">
                <p className="font-semibold text-gray-300">Gatepass ID: {gatepass._id}</p>
                <p className={`text-sm font-medium ${gatepass.approvedStatus === 'approved' ? 'text-green-400' : gatepass.approvedStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>Status: {gatepass.approvedStatus}</p>
                <p className="text-gray-400">Requested By: {gatepass.name}</p>
                <p className="text-gray-400">Roll No: {gatepass.rollNo}</p>
                <p className="text-gray-400">Email: {gatepass.email}</p>
                <p className="text-gray-400">Contact: {gatepass.contact}</p>
                <p className="text-gray-400">Date: {new Date(gatepass.date).toLocaleDateString()}</p>
                <p className="text-gray-400">Time: {gatepass.time}</p>
                <p className="text-gray-200 text-xl">Reason: {gatepass.reason}</p>
                <p className="text-gray-400">Created At: {new Date(gatepass.createdAt).toLocaleString()}</p>
      
                {activeTab === "gatepass" && (  
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => updateGatepassStatus(gatepass._id, "approved")}
                      className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateGatepassStatus(gatepass._id, "rejected")}
                      className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        );
      };
      
      const renderContent = () => {
        if (loading) {
          return <p className="text-gray-400">Loading gatepass data...</p>;
        }
      
        switch (activeTab) {
          case "gatepass":
            return (
              <div className="p-6 bg-gray-800 rounded-lg shadow-2xl">
                <h2 className="text-xl font-semibold text-center mb-6 text-gray-200">Pending Gate Pass Requests</h2>
                {renderGatepassList(pendingGatepasses)}
              </div>
            );
      
          case "approvedGatepass":
            return (
              <div className="p-6 bg-gray-800 rounded-lg shadow-2xl">
                <h2 className="text-xl font-semibold text-center mb-6 text-gray-200">Approved Gate Passes</h2>
                {renderGatepassList(approvedGatepasses)}
              </div>
            );
      
          case "rejectedGatepass":
            return (
              <div className="p-6 bg-gray-800 rounded-lg shadow-2xl">
                <h2 className="text-xl font-semibold text-center mb-6 text-gray-200">Rejected Gate Passes</h2>
                {renderGatepassList(rejectedGatepasses)}
              </div>
            );
      
          default:
            return <p className="text-gray-200">Select a tab to view content.</p>;
        }
      };
      
      return (
        <div className="bg-gray-900 min-h-screen text-gray-200">
          <nav className="bg-gray-800 p-6 shadow-md">
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setActiveTab("gatepass")}
                className={`px-6 py-3 font-semibold rounded-md text-lg ${activeTab === "gatepass" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-blue-400"}`}
              >
                Gate Pass Requests
              </button>
              <button
                onClick={() => setActiveTab("approvedGatepass")}
                className={`px-6 py-3 font-semibold rounded-md text-lg ${activeTab === "approvedGatepass" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-blue-400"}`}
              >
                Approved Gate Passes
              </button>
              <button
                onClick={() => setActiveTab("rejectedGatepass")}
                className={`px-6 py-3 font-semibold rounded-md text-lg ${activeTab === "rejectedGatepass" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-blue-400"}`}
              >
                Rejected Gate Passes
              </button>
            </div>
          </nav>
      
          <div className="p-4 md:p-8">{renderContent()}</div>
        </div>
      );
      
  };
  
export default TeacherGatepass;
  



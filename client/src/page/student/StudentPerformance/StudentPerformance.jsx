import React, { useState, useEffect } from "react";

const StudentPerformance = () => {
  const [student, setStudent] = useState({
    RollNo: "",
  });
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
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
          setStudent({ RollNo });
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
          setStudent({ RollNo: "" });
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (student.RollNo) {
      fetch(`${apiBaseUrl}/api/performance/${student.RollNo}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setPerformanceData(data[0]); // Assuming the response is an array
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching performance data:", error);
          setError("Could not fetch performance data.");
          setLoading(false);
        });
    }
  }, [student.RollNo]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-200 flex items-center justify-center">
        <p className="text-lg text-red-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-200 flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // Variables to store performance data
  const {
    RollNo,
    Name,
    "10th %age": tenthPercentage,
    "12th %age": twelfthPercentage,
    "Sem-1 SGPA": sem1SGPA,
    "Sem-2 SGPA": sem2SGPA,
    "Sem-3 SGPA": sem3SGPA,
    "Sem-4 SGPA": sem4SGPA,
    CGPA,
  } = performanceData || {};

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Student Performance</h1>
        </div>
      </nav>

      {/* Performance Data */}
      <div className="p-8 flex justify-center">
        <div className="bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-lg">
          {/* <h2 className="text-xl font-semibold text-red-600 mb-4">
            Performance Details
          </h2> */}
          <h1 className="text-xl font-semibold text-red-600 py-5 text-center">
            <p>{Name}</p>
            <p className=" text-gray-400 text-base">{RollNo}</p>
            
          </h1>
          <p className="border-b border-gray-700"></p>
          <table className="w-full text-left text-gray-200">
            <tbody>
              
              <tr className="border-b border-gray-700">
                <td className="py-2 font-semibold">10th %age:</td>
                <td className="py-2">{tenthPercentage}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 font-semibold">12th %age:</td>
                <td className="py-2">{twelfthPercentage}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 font-semibold">Sem-1 SGPA:</td>
                <td className="py-2">{sem1SGPA}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 font-semibold">Sem-2 SGPA:</td>
                <td className="py-2">{sem2SGPA}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 font-semibold">Sem-3 SGPA:</td>
                <td className="py-2">{sem3SGPA}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 font-semibold">Sem-4 SGPA:</td>
                <td className="py-2">{sem4SGPA}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 font-semibold text-lg">CGPA:</td>
                <td className="py-2 font-bold text-lg">{CGPA}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;

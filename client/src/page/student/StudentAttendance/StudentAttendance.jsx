import React, { useState, useEffect } from "react";

const StudentAttendance = () => {
  const [student, setStudent] = useState({
    RollNo: "",
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch RollNo from token
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

  // Fetch attendance data for the student
  useEffect(() => {
    if (student.RollNo) {
      fetch(`${apiBaseUrl}/api/attendance/${student.RollNo}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setAttendanceData(data); // Assuming data is an array of attendance records
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
          setError("Could not fetch attendance data.");
          setLoading(false);
        });
    }
  }, [student.RollNo]);

  // Calculate attendance percentage
  const totalClasses = attendanceData.length;
  const totalPresent = attendanceData.filter(record => record.status === 'Present').length;
  const attendancePercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0;

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

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Student Attendance</h1>
        </div>
      </nav>

      {/* Attendance Data */}
      <div className="p-8 flex justify-center">
        <div className="bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-lg">
          <h1 className="text-xl font-semibold text-red-600 py-5 text-center">
            <p>{`Roll No: ${student.RollNo}`}</p>
          </h1>
          <p className="border-b border-gray-700"></p>

          {/* Attendance Percentage */}
          <div className="text-center text-lg font-semibold text-gray-300 mt-4">
            <p>Attendance Percentage: {attendancePercentage}%</p>
          </div>

          <table className="w-full text-left text-gray-200 mt-4">
            <thead>
              <tr>
                <th className="py-2 border-b border-gray-700">Date</th>
                <th className="py-2 border-b border-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2">{record.date}</td>
                  <td className="py-2">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendanceData.length === 0 && (
            <p className="text-center text-gray-400 mt-4">No attendance records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;

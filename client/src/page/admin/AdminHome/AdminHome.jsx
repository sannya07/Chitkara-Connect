import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminHome = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [teacherCount, setTeacherCount] = useState(null);
  const [supportCount, setSupportCount] = useState(null);
  const [queriesCount, setQueriesCount] = useState(null);
  const [noticesCount, setNoticesCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch counts when the component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [studentRes, teacherRes, supportRes, queriesRes, noticesRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/students/count`),
          axios.get(`${apiBaseUrl}/api/teachers/count`),
          axios.get(`${apiBaseUrl}/api/support/count`),
          axios.get(`${apiBaseUrl}/api/queries/count`),
          axios.get(`${apiBaseUrl}/api/notices/count`)
        ]);

        setStudentCount(studentRes.data.count);
        setTeacherCount(teacherRes.data.count);
        setSupportCount(supportRes.data.count);
        setQueriesCount(queriesRes.data.count);
        setNoticesCount(noticesRes.data.count);

        setLoading(false); // Stop loading once all data is fetched
      } catch (error) {
        console.error("Error fetching counts:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <h1 className="text-2xl font-semibold mb-6">Statistics</h1>

      {/* Display loading indicator while fetching data */}
      {loading ? (
        <p className="text-gray-400">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Students */}
          <div className="bg-gray-800 p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-red-600">Total Students</h2>
            <p className="text-4xl font-bold text-white mt-4">{studentCount}</p>
          </div>

          {/* Total Teachers */}
          <div className="bg-gray-800 p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-blue-600">Total Teachers</h2>
            <p className="text-4xl font-bold text-white mt-4">{teacherCount}</p>
          </div>

          {/* Total Support */}
          <div className="bg-gray-800 p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-green-600">Total Support</h2>
            <p className="text-4xl font-bold text-white mt-4">{supportCount}</p>
          </div>

          {/* Total Queries */}
          <div className="bg-gray-800 p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-yellow-600">Total Queries</h2>
            <p className="text-4xl font-bold text-white mt-4">{queriesCount}</p>
          </div>

          {/* Total Notices */}
          <div className="bg-gray-800 p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-purple-600">Total Notices</h2>
            <p className="text-4xl font-bold text-white mt-4">{noticesCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;

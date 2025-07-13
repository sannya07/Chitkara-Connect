import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch the list of teachers when the component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/teachers`);
        setTeachers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return <p>Loading teachers...</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <h1 className="text-2xl font-semibold mb-6">List of Teachers</h1>
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-md shadow-lg">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Teacher ID</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td className="px-4 py-2">{teacher.name}</td>
                <td className="px-4 py-2">{teacher.teacherId}</td>
                <td className="px-4 py-2">{teacher.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageTeachers;

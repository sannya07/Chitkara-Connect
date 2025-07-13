import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminManageStudents = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

  // Fetch the students data when the component mounts
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/student`); // Fetch students from backend
        setStudentsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students data:', error);
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, []);

  if (loading) {
    return <p>Loading students...</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <h1 className="text-2xl font-semibold mb-6">Students Collection</h1>
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-md shadow-lg">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Roll No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Father's Name</th>
              <th className="px-4 py-2 text-left">Mother's Name</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Date of Birth</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Phone Number</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Group</th>
              <th className="px-4 py-2 text-left">Designation</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student) => (
              <tr key={student._id}>
                <td className="px-4 py-2">{student.RollNo}</td>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.FatherName}</td>
                <td className="px-4 py-2">{student.MotherName}</td>
                <td className="px-4 py-2">{student.Gender}</td>
                <td className="px-4 py-2">{new Date(student.Dob).toLocaleDateString()}</td>
                <td className="px-4 py-2">{student.Category}</td>
                <td className="px-4 py-2">{student.phoneNo}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.group}</td>
                <td className="px-4 py-2">{student.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageStudents;

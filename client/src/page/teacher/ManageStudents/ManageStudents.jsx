import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch student details from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/manage-students`);
        setStudents(response.data); // Set the fetched students data in state
        setFilteredStudents(response.data); // Initially, show all students
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchStudents(); // Call the fetch function
  }, []);

  // Filter students based on selected group
  const handleGroupChange = (event) => {
    const group = event.target.value;
    setSelectedGroup(group);

    if (group === '') {
      // Show all students if no group is selected
      setFilteredStudents(students);
    } else {
      // Filter students by the selected group
      setFilteredStudents(students.filter(student => student.group === group));
    }
  };

  // Get all unique groups for the dropdown
  const uniqueGroups = Array.from(new Set(students.map(student => student.group)));

  // Rendering the students in a table format
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Students</h1>

      <div className="mb-4">
        <label htmlFor="groupFilter" className="text-lg">Filter by Group: </label>
        <select
          id="groupFilter"
          value={selectedGroup}
          onChange={handleGroupChange}
          className="bg-gray-800 text-gray-200 p-2 rounded-md"
        >
          <option value="">All Groups</option>
          {uniqueGroups.map(group => (
            <option key={group} value={group}>Group {group}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading student data...</p>
      ) : (
        <table className="table-auto w-full text-left bg-gray-800 rounded-md">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-2">Roll No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Father's Name</th>
              <th className="px-4 py-2">Mother's Name</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">DOB</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Phone No</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Group</th>
              <th className="px-4 py-2">Designation</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="border-t border-gray-600">
                <td className="px-4 py-2">{student.RollNo}</td>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.FatherName}</td>
                <td className="px-4 py-2">{student.MotherName}</td>
                <td className="px-4 py-2">{student.Gender}</td>
                <td className="px-4 py-2">{student.Dob}</td>
                <td className="px-4 py-2">{student.Category}</td>
                <td className="px-4 py-2">{student.phoneNo}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.group}</td>
                <td className="px-4 py-2">{student.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageStudents;

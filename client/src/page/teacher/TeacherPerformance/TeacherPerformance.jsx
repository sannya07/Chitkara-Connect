import React, { useState, useEffect } from 'react';

const TeacherPerformance = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/students-performance`);
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student performance:', error);
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchName(value);
    filterStudents(value);
  };

  const filterStudents = (name) => {
    const filtered = students.filter((student) =>
      student.Name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-900 text-gray-200 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Student Performance</h1>

      {/* Search Filter */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchName}
          onChange={handleSearch}
          placeholder="Search by name"
          className="p-3 border rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Student Performance Table */}
      {loading ? (
        <p className="text-center text-gray-400">Loading student performance...</p>
      ) : filteredStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto bg-gray-800 rounded-lg">
            <thead>
              <tr className="text-gray-300 bg-gray-700">
                <th className="p-4">Roll No</th>
                <th className="p-4">Name</th>
                <th className="p-4">10th %</th>
                <th className="p-4">12th %</th>
                <th className="p-4">Sem-1 SGPA</th>
                <th className="p-4">Sem-2 SGPA</th>
                <th className="p-4">Sem-3 SGPA</th>
                <th className="p-4">Sem-4 SGPA</th>
                <th className="p-4">CGPA</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-t border-gray-700">
                  <td className="p-4">{student.RollNo}</td>
                  <td className="p-4">{student.Name}</td>
                  <td className="p-4">{student['10th %age']}</td>
                  <td className="p-4">{student['12th %age']}</td>
                  <td className="p-4">{student['Sem-1 SGPA']}</td>
                  <td className="p-4">{student['Sem-2 SGPA']}</td>
                  <td className="p-4">{student['Sem-3 SGPA']}</td>
                  <td className="p-4">{student['Sem-4 SGPA']}</td>
                  <td className="p-4">{student.CGPA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400">No students found.</p>
      )}
    </div>
  );
};

export default TeacherPerformance;

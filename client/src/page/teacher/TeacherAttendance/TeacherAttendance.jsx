import React, { useState, useEffect } from 'react';

const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/students`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setStudents(data); // The response directly gives the students array
        setFilteredStudents(data); // Initially, show all students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleAttendanceChange = (rollNo, status) => {
    setAttendance(prev => ({ ...prev, [rollNo]: status }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const attendanceEntries = Object.entries(attendance).map(([rollNo, status]) => ({
      studentId: rollNo,  // Change rollNo to studentId
      status,
      markedBy: 'teacherId123', // Replace with actual teacher ID
    }));

    const payload = {
      attendanceRecords: attendanceEntries,
      date: new Date().toISOString().split('T')[0], // Current date
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/mark-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setToast({ message: 'Attendance marked successfully!', type: 'success' });
      } else {
        const error = await response.json();
        setToast({ message: 'Error submitting attendance', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setToast({ message: 'Error submitting attendance', type: 'error' });
    }
    setLoading(false);
  };

  // Handle group selection
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

  // Get all unique groups for the dropdown dynamically
  const uniqueGroups = Array.from(new Set(students.map(student => student.group)));

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-200">Mark Attendance</h1>

        {/* Group selection dropdown */}
        <div className="mb-4">
          <label htmlFor="group" className="text-lg font-medium text-gray-400">Select Group</label>
          <select
            id="group"
            value={selectedGroup}
            onChange={handleGroupChange}
            className="mt-2 block w-full py-2 px-4 border rounded-lg border-gray-300 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Groups</option>
            {uniqueGroups.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Form for selected group */}
        <div className="space-y-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div
                key={`${student.RollNo}-${student.group}`}  // Concatenate RollNo and group to form a unique key
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md mb-3"
              >
                <span className="text-lg font-medium text-gray-200">{student.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAttendanceChange(student.RollNo, 'Present')}
                    className={`px-4 py-2 rounded-lg ${
                      attendance[student.RollNo] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-500'
                    } hover:bg-green-400 focus:outline-none`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student.RollNo, 'Absent')}
                    className={`px-4 py-2 rounded-lg ${
                      attendance[student.RollNo] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-500'
                    } hover:bg-red-400 focus:outline-none`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No students in this group.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full mt-6 py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Attendance'}
        </button>

        {/* Toast Notification */}
        {toast.message && (
          <div
            className={`mt-4 p-4 rounded-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <p>{toast.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;

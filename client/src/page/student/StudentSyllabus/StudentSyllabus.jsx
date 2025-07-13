import React, { useState, useEffect } from 'react';

// The StudentsSyllabus component
const StudentsSyllabus = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  useEffect(() => {
    // Fetch syllabus data from the backend API
    const fetchSyllabus = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/syllabus`);

        if (response.ok) {
          const data = await response.json();
          setSyllabus(data);
        } else {
          console.error('Error fetching syllabus data');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    fetchSyllabus();
  }, []); // Only run once when the component mounts

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter syllabus based on the search term
  const filteredSyllabus = syllabus.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-800">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Student Syllabus</h1>

      <input
        type="text"
        placeholder="Search by course name..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 mb-6 border bg-gray-900 text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {filteredSyllabus.length > 0 ? (
        filteredSyllabus.map((course, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-900 text-white"
          >
            <h2 className="text-xl font-semibold text-red-500">{course.courseName}</h2>
            <p className="mt-2"><strong>Semester:</strong> {course.semester}</p>
            <ul className="mt-4">
              {course.topics.map((topic, i) => (
                <li key={i} className="list-disc pl-5">{topic}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No syllabus found for the given search term.</p>
      )}
    </div>
  );
};

export default StudentsSyllabus;

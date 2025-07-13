import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch teacher details from the backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/contact-teachers`);
        setTeachers(response.data); // Set the fetched teacher data in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchTeachers(); // Call the fetch function
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <h1 className="text-2xl font-semibold mb-6">Contact Your Mentor</h1>

      {loading ? (
        <p>Loading teacher information...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-blue-400">{teacher.name}</h2>
              <p className="text-gray-300">Gender: {teacher.Gender}</p>
              <p className="text-gray-300">Phone: {teacher.phoneNo}</p>
              <p className="text-gray-300">Email: {teacher.email}</p>
              <a
                href={`mailto:${teacher.email}`}
                className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Contact Mentor
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactTeachers;

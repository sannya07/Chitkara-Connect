import React, { useState } from 'react';
import axios from 'axios';

const AddSyllabus = () => {
  const [courseName, setCourseName] = useState('');
  const [topics, setTopics] = useState('');
  const [semester, setSemester] = useState('');
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const topicList = topics.split(',').map(topic => topic.trim());
    const syllabusData = { courseName, topics: topicList, semester };

    try {
      await axios.post(`${apiBaseUrl}/api/syllabus-add`, syllabusData);
      alert('Syllabus added successfully!');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Failed to add syllabus.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      {/* Navbar */}
      {/* <nav className="bg-gray-800 p-4 rounded-md mb-8 shadow-md"> */}
        {/* <div className="flex justify-center space-x-8"> */}
          {/* <button className="px-4 py-2 font-semibold rounded-md bg-red-600 text-white">
            SYLLABUS
          </button> */}
        {/* </div> */}
      {/* </nav> */}

      {/* Form Container */}
      <div className="p-8 bg-gray-800 rounded-md shadow-md max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-200">Add Syllabus</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">Course Name:</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-300 bg-gray-700"
              placeholder="Enter course name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Topics (comma-separated):</label>
            <input
              type="text"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-300 bg-gray-700"
              placeholder="Enter topics separated by commas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Semester:</label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-300 bg-gray-700"
              placeholder="Enter semester"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Add Syllabus
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSyllabus;

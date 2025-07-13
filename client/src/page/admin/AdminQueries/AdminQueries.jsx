import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminQueries = () => {
  const [queriesData, setQueriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch the queries data when the component mounts
  useEffect(() => {
    const fetchQueriesData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/queries`); // Fetch queries from backend
        setQueriesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching queries data:', error);
        setLoading(false);
      }
    };

    fetchQueriesData();
  }, []);

  if (loading) {
    return <p>Loading queries...</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <h1 className="text-2xl font-semibold mb-6">Queries Collection</h1>
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-md shadow-lg">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Roll No</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Topic</th>
              <th className="px-4 py-2 text-left">Tags</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Likes</th>
              <th className="px-4 py-2 text-left">Solution</th>
              <th className="px-4 py-2 text-left">Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {queriesData.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.rollNo}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{item.topic}</td>
                <td className="px-4 py-2">{item.tags.join(', ')}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">{item.likes}</td>
                <td className="px-4 py-2">{item.solution || 'No solution provided'}</td>
                <td className="px-4 py-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQueries;

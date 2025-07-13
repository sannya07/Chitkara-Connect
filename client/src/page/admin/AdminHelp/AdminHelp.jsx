import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHelp = () => {
  const [supportData, setSupportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch the support collection data when the component mounts
  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/supports`); // Update API endpoint
        setSupportData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching support collection:', error);
        setLoading(false);
      }
    };

    fetchSupportData();
  }, []);

  if (loading) {
    return <p>Loading support data...</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      <h1 className="text-2xl font-semibold mb-6">Support Collection</h1>
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-md shadow-lg">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Query Type</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {supportData.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{item.role}</td>
                <td className="px-4 py-2">{item.queryType}</td>
                <td className="px-4 py-2">{item.message}</td>
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

export default AdminHelp;

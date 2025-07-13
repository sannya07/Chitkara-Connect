import React, { useState, useEffect } from "react";

const ManageQueries = () => {
  const [unsolvedQueries, setUnsolvedQueries] = useState([]);
  const [solvedQueries, setSolvedQueries] = useState([]);
  const [activeTab, setActiveTab] = useState("unsolved"); // State to toggle between tabs
  const [loading, setLoading] = useState(true);
  const [solutions, setSolutions] = useState({}); // To track solutions for unsolved queries

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);

        // Fetch unsolved queries
        const unsolvedResponse = await fetch("http://localhost:3000/api/queries-without-solution");
        if (unsolvedResponse.ok) {
          const unsolvedData = await unsolvedResponse.json();
          setUnsolvedQueries(unsolvedData.queries || []);
        }

        // Fetch solved queries
        const solvedResponse = await fetch("http://localhost:3000/api/queries-with-solution");
        if (solvedResponse.ok) {
          const solvedData = await solvedResponse.json();
          setSolvedQueries(solvedData.queries || []);
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleSolutionChange = (queryId, value) => {
    setSolutions((prevSolutions) => ({
      ...prevSolutions,
      [queryId]: value,
    }));
  };

  const updateSolution = async (queryId) => {
    const solution = solutions[queryId];

    if (!solution) {
      alert("Solution cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/queries/update-solution", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryId, solution }),
      });

      if (response.ok) {
        alert("Solution updated successfully!");

        // Move the updated query to the "Solved Queries" list
        const updatedQuery = unsolvedQueries.find((query) => query._id === queryId);
        if (updatedQuery) {
          updatedQuery.solution = solution;

          setUnsolvedQueries(unsolvedQueries.filter((query) => query._id !== queryId));
          setSolvedQueries([...solvedQueries, updatedQuery]);
        }
      } else {
        alert("Failed to update solution.");
      }
    } catch (error) {
      console.error("Error updating solution:", error);
      alert("An error occurred while updating the solution.");
    }
  };

  const renderQueriesList = (queries, showInputField = false) => {
    if (!queries.length) {
      return <p className="text-gray-500">No queries to display.</p>;
    }

    return (
      <ul>
        {queries.map((query) => (
          <li key={query._id} className="p-4 mb-4 bg-gray-700 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-300">Topic: {query.topic}</p>
            <p className="text-gray-400">Description: {query.description}</p>
            <p className="text-gray-400">Name: {query.name}</p>
            <p className="text-gray-400">Roll No: {query.rollNo}</p>
            <p className="text-gray-400">Email: {query.email}</p>
            <p className="text-gray-400">Tags: {query.tags?.join(", ")}</p>
            <p className="text-gray-400">Likes: {query.likes}</p>
            <p className="text-gray-400">
              Created At: {new Date(query.createdAt).toLocaleString()}
            </p>
            {query.solution !== "null" && (
              <p className="text-green-400">Solution: {query.solution}</p>
            )}
            {showInputField && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter solution"
                  value={solutions[query._id] || ""}
                  onChange={(e) => handleSolutionChange(query._id, e.target.value)}
                  className="p-2 w-full bg-gray-800 text-gray-300 rounded-md mb-2"
                />
                <button
                  onClick={() => updateSolution(query._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Solution
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Main Navbar */}
      <nav className="bg-gray-800 p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-100">
          Manage Queries
        </h1>
      </nav>

      {/* Secondary Navbar */}
      <nav className="bg-gray-700 p-4 shadow-md">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab("unsolved")}
            className={`px-6 py-2 text-lg font-semibold rounded-md ${
              activeTab === "unsolved"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            Unsolved Queries
          </button>
          <button
            onClick={() => setActiveTab("solved")}
            className={`px-6 py-2 text-lg font-semibold rounded-md ${
              activeTab === "solved"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            Solved Queries
          </button>
        </div>
      </nav>

      {/* Content Section */}
      <div className="p-6">
        {loading ? (
          <p className="text-gray-400">Loading queries...</p>
        ) : activeTab === "unsolved" ? (
          <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Unsolved Queries</h2>
            {renderQueriesList(unsolvedQueries, true)} {/* Show input field for unsolved */}
          </section>
        ) : (
          <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Solved Queries</h2>
            {renderQueriesList(solvedQueries)}
          </section>
        )}
      </div>
    </div>
  );
};

export default ManageQueries;

import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaRegThumbsUp, FaComment } from "react-icons/fa"; // Import React Icons

const StudentQueries = () => {
  const [activeTab, setActiveTab] = useState("queries");
  const [formData, setFormData] = useState({
    topic: "",
    tags: "",
    query: "",
  });
  const [userData, setUserData] = useState({
    name: "",
    rollNo: "",
    email: "",
  });
  const [queries, setQueries] = useState([]); // State to hold queries without solution
  const [solvedQueries, setSolvedQueries] = useState([]); // State to hold solved queries
  const [yourQueries, setYourQueries] = useState([]);
  const [queryFilter, setQueryFilter] = useState("all");
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Fetch user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetch(`${apiBaseUrl}/api/post-data-from-token/${token}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then((data) => {
          const { name, RollNo, email } = data.decoded;
          setUserData({
            name,
            rollNo: RollNo,
            email,
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("No token found");
    }
  }, [activeTab]);

  // Fetch queries without solution
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/queries-without-solution`)
      .then((response) => response.json())
      .then((data) => {
        setQueries(data.queries || []); // Update state with fetched queries
      })
      .catch((error) => {
        console.error("Error fetching queries:", error);
      });
  }, [activeTab]);

  // Fetch solved queries
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/queries-with-solution`)
      .then((response) => response.json())
      .then((data) => {
        setSolvedQueries(data.queries || []); // Update state with fetched solved queries
      })
      .catch((error) => {
        console.error("Error fetching solved queries:", error);
      });
  }, [activeTab]);

  // Fetch queries specific to the logged-in user's roll number
useEffect(() => {
  if (userData.rollNo) {
    fetch(`${apiBaseUrl}/api/queries-by-rollno/${userData.rollNo}`)
      .then((response) => response.json())
      .then((data) => {
        setYourQueries(data.queries); // Update state with fetched queries
      })
      .catch((error) => {
        console.error("Error fetching queries by rollNo:", error);
      });
  }
}, [userData.rollNo]); // Trigger this effect when rollNo changes


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const queryData = {
      name: userData.name,
      rollNo: userData.rollNo,
      email: userData.email,
      topic: formData.topic,
      tags: tagsArray,
      query: formData.query,
      likes: 0,
      solution: "null",
    };

    fetch(`${apiBaseUrl}/api/submit-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting query:", error);
        alert("Failed to submit query. Please try again later.");
      });

    setFormData({
      topic: "",
      tags: "",
      query: "",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "queries":
        return (
          <div>
            <div className="space-y-6 mt-6">
              {queries.length > 0 ? (
                queries.map((query, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl"
                  >
                    <h3 className="text-xl font-semibold text-gray-200">
                      {query.topic}
                    </h3>
                    <p className="text-gray-300 mt-2">{query.description}</p>
                    <div className="flex flex-col flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="py-1 ">{query.tags.join(", ")}</span>
                      <span className="flex items-center">
                        <FaComment className="inline-block mr-2 text-gray-400" />
                        Solution:&nbsp;
                        <span className="bg-gray-700 px-3 py-1 rounded-lg">
                          {query.solution}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <FaRegThumbsUp className="text-gray-400" />
                        <span className="text-gray-300">{query.likes}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          {new Date(query.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No queries without a solution found.</p>
              )}
            </div>
          </div>
        );
      case "yourQueries":
        const filteredQueries =
          queryFilter === "all"
            ? yourQueries
            : queryFilter === "solved"
            ? yourQueries.filter((query) => query.solution !== "null")
            : yourQueries.filter((query) => query.solution === "null");

        return (
          <div>
            <div className="flex justify-center space-x-4 my-4">
              <button
                onClick={() => setQueryFilter("all")}
                className={`px-4 py-2 font-semibold rounded-md ${
                  queryFilter === "all"
                    ? "bg-red-600 text-white"
                    : "hover:text-red-400 text-gray-400"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setQueryFilter("solved")}
                className={`px-4 py-2 font-semibold rounded-md ${
                  queryFilter === "solved"
                    ? "bg-red-600 text-white"
                    : "hover:text-red-400 text-gray-400"
                }`}
              >
                Solved
              </button>
              <button
                onClick={() => setQueryFilter("unsolved")}
                className={`px-4 py-2 font-semibold rounded-md ${
                  queryFilter === "unsolved"
                    ? "bg-red-600 text-white"
                    : "hover:text-red-400 text-gray-400"
                }`}
              >
                Unsolved
              </button>
            </div>
            <div className="space-y-6 mt-6">
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl"
                  >
                    <h3 className="text-xl font-semibold text-gray-200">
                      {query.topic}
                    </h3>
                    <p className="text-gray-300 mt-2">{query.description}</p>
                    <div className="flex flex-col flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="py-1 ">{query.tags.join(", ")}</span>
                      <span className="flex items-center">
                        <FaComment className="inline-block mr-2 text-gray-400" />
                        Solution:&nbsp;
                        <span className="bg-gray-700 px-3 py-1 rounded-lg">
                          {query.solution}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <FaRegThumbsUp className="text-gray-400" />
                        <span className="text-gray-300">{query.likes}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          {new Date(query.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No queries found for this filter.</p>
              )}
            </div>
          </div>
        );
      case "writeQuery":
        return (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold text-center text-gray-200">
              Write a Query
            </h2>
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-400"
              >
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Enter the topic of your query"
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-400"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Enter tags for your query (separate by commas)"
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="query"
                className="block text-sm font-medium text-gray-400"
              >
                Query Description
              </label>
              <textarea
                id="query"
                name="query"
                value={formData.query}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your query in detail"
                className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Submit Query
              </button>
            </div>
          </form>
        );
      case "solvedQueries":
        return (
          <div>
            <div className="space-y-6 mt-6">
              {solvedQueries.length > 0 ? (
                solvedQueries.map((query, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl"
                  >
                    <h3 className="text-xl font-semibold text-gray-200">
                      {query.topic}
                    </h3>
                    <p className="text-gray-300 mt-2">{query.description}</p>
                    <div className="flex flex-col flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="py-1 ">{query.tags.join(", ")}</span>
                      <span className="flex items-center">
                        <FaComment className="inline-block mr-2 text-gray-400" />
                        Solution:&nbsp;
                        <span className="bg-gray-700 px-3 py-1 rounded-lg">
                          {query.solution}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <FaRegThumbsUp className="text-gray-400" />
                        <span className="text-gray-300">{query.likes}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          {new Date(query.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No solved queries found.</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/4 w-full bg-gray-800 p-6 lg:min-h-screen">
        <nav className="space-y-6">
          <button
            onClick={() => setActiveTab("queries")}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === "queries"
                ? "bg-red-600 text-white shadow-xl"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Queries
          </button>
          <button
            onClick={() => setActiveTab("yourQueries")}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === "yourQueries"
                ? "bg-red-600 text-white shadow-xl"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Your Queries
          </button>
          <button
            onClick={() => setActiveTab("writeQuery")}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === "writeQuery"
                ? "bg-red-600 text-white shadow-xl"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Write Query
          </button>
          <button
            onClick={() => setActiveTab("solvedQueries")}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === "solvedQueries"
                ? "bg-red-600 text-white shadow-xl"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Solved Queries
          </button>
        </nav>
      </div>
  
      <div className="lg:w-3/4 w-full bg-gray-900 p-6 lg:p-12 overflow-y-auto">
        <div className="space-y-8">{renderContent()}</div>
      </div>
    </div>
  );
  
  
  
};

export default StudentQueries;

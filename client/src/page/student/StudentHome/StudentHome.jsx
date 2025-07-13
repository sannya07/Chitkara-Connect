import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentHome = () => {
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const [activeTab, setActiveTab] = useState("mentorNotice");
  const [events, setEvents] = useState([]);  // State to store the events data
  const [mentorNotices, setMentorNotices] = useState([]); // State for mentor notices
  const [notices, setNotices] = useState([]);  // State for notices
  const [loading, setLoading] = useState(true);  // Loading state to show loading spinner
  // Function to fetch events, mentor notices, and notices data
  const fetchData = async () => {
    try {
      const eventResponse = await axios.get(`${apiBaseUrl}/api/get-events`);
      const mentorNoticeResponse = await axios.get(`${apiBaseUrl}/api/get-mentor-notices`);
      const noticeResponse = await axios.get(`${apiBaseUrl}/api/get-notices`);

      setEvents(eventResponse.data);  // Set the fetched events in state
      setMentorNotices(mentorNoticeResponse.data); // Set the fetched mentor notices in state
      setNotices(noticeResponse.data); // Set the fetched notices in state
      setLoading(false);  // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);  // Set loading to false even if there's an error
    }
  };

  // Fetch events, mentor notices, and notices on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "mentorNotice":
        return (
          <div className="space-y-4">
            {loading ? (
              <p>Loading mentor notices...</p>
            ) : (
              mentorNotices.map((notice) => (
                <div key={notice._id} className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-xl font-semibold text-red-600">{notice.heading}</h3>
                  <p className="text-gray-400">{notice.description}</p>
                  <p className="text-gray-500">Teacher: {notice.teacherName}</p>
                  <p className="text-gray-500">Contact: {notice.email}</p>
                </div>
              ))
            )}
          </div>
        );
      case "events":
        return (
          <div className="space-y-4">
            {loading ? (
              <p>Loading events...</p>
            ) : (
              events.map((event) => (
                <div key={event._id} className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-xl font-semibold text-red-600">{event.eventName}</h3>
                  <p className="text-gray-400">{event.description}</p>
                  <p className="text-gray-500">Hosted by: {event.hostBy}</p>
                  <p className="text-gray-500">Date: {event.date}</p>
                  <p className="text-gray-500">Time: {event.time}</p>
                  <p className="text-gray-500">Contact: {event.contactEmail}</p>
                </div>
              ))
            )}
          </div>
        );
      case "notice":
        return (
          <div className="space-y-4">
            {loading ? (
              <p>Loading notices...</p>
            ) : (
              notices.map((notice) => (
                <div key={notice._id} className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-xl font-semibold text-red-600">{notice.heading}</h3>
                  <p className="text-gray-400">{notice.description}</p>
                </div>
              ))
            )}
          </div>
        );
      default:
        return <p className="text-gray-200">Select a tab to view content.</p>;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Small Navbar */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab("mentorNotice")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "mentorNotice"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Mentor Notice
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "events"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab("notice")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "notice"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Notice
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="p-8">{renderContent()}</div>
    
    </div>
  );
};

export default StudentHome;

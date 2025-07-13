import React, { useState, useEffect } from "react";
import axios from "axios";
import TeacherNoticeCreate from "./TeacherNoticeCreate";
import ChatBot from "../../../chatbot/Chatbot";

const TeacherHome = () => {
  const [activeTab, setActiveTab] = useState("mentorNotice");
  const [mentorNotices, setMentorNotices] = useState([]); // State to store mentor notices
  const [events, setEvents] = useState([]); // State to store events
  const [notices, setNotices] = useState([]); // State to store notices
  const [loading, setLoading] = useState(true); // Loading state to show loading spinner
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Function to fetch data for mentor notices, events, and notices
  const fetchData = async () => {
    try {
      const mentorNoticeResponse = await axios.get(`${apiBaseUrl}/api/get-mentor-notices`);
      const eventResponse = await axios.get(`${apiBaseUrl}/api/get-events`);
      const noticeResponse = await axios.get(`${apiBaseUrl}/api/get-notices`);

      setMentorNotices(mentorNoticeResponse.data); // Set mentor notices
      setEvents(eventResponse.data); // Set events
      setNotices(noticeResponse.data); // Set notices
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "mentorNotice":
        return (
          <div>
            <h2 className="text-lg font-semibold">Mentor Notices</h2>
            {loading ? (
              <p>Loading mentor notices...</p>
            ) : (
              mentorNotices.map((notice) => (
                <div key={notice._id} className="bg-gray-800 p-4 rounded-md mb-4">
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
          <div>
            <h2 className="text-lg font-semibold">Events</h2>
            {loading ? (
              <p>Loading events...</p>
            ) : (
              events.map((event) => (
                <div key={event._id} className="bg-gray-800 p-4 rounded-md mb-4">
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
      case "notices":
        return (
          <div>
            <h2 className="text-lg font-semibold">Notices</h2>
            {loading ? (
              <p>Loading notices...</p>
            ) : (
              notices.map((notice) => (
                <div key={notice._id} className="bg-gray-800 p-4 rounded-md mb-4">
                  <h3 className="text-xl font-semibold text-red-600">{notice.heading}</h3>
                  <p className="text-gray-400">{notice.description}</p>
                </div>
              ))
            )}
          </div>
        );
      case "create":
        return (
          <div>
            <h2 className="text-lg font-semibold">Create New Item</h2>
            <TeacherNoticeCreate />
          </div>
        );
      default:
        return <p className="text-gray-200">Select an option to view content.</p>;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 rounded-md mb-8 shadow-md">
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
            onClick={() => setActiveTab("notices")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "notices"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Notices
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "create"
                ? "bg-red-600 text-white"
                : "hover:text-red-400 text-gray-400"
            }`}
          >
            Create
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="p-8 bg-gray-800 rounded-md shadow-md">
        {renderContent()}
      </div>
      <ChatBot/>
    </div>
  );
};

export default TeacherHome;

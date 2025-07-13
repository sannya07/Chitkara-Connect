import React, { useState } from "react";

const TeacherNoticeCreate = () => {
  const [activeTab, setActiveTab] = useState("createMentorNotice");
  const [loading, setLoading] = useState(false); // Define loading state
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const [mentorNotice, setMentorNotice] = useState({
    teacherName: "",
    email: "",
    heading: "",
    description: "",
  });
  const [eventNotice, setEventNotice] = useState({
    eventName: "",
    hostBy: "",
    contactEmail: "",
    date: "",
    time: "",
    description: "",
  });
  const [generalNotice, setGeneralNotice] = useState({
    heading: "",
    contactEmail: "",
    description: "",
  });

  // Handle form changes
  const handleMentorNoticeChange = (e) => {
    const { name, value } = e.target;
    setMentorNotice({ ...mentorNotice, [name]: value });
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventNotice({ ...eventNotice, [name]: value });
  };

  const handleGeneralNoticeChange = (e) => {
    const { name, value } = e.target;
    setGeneralNotice({ ...generalNotice, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formData = {};

    if (activeTab === "createMentorNotice") {
      formData = {
        type: "mentorNotice",
        data: mentorNotice,
      };
    } else if (activeTab === "createEvent") {
      formData = {
        type: "eventNotice",
        data: eventNotice,
      };
    } else if (activeTab === "createNotice") {
      formData = {
        type: "generalNotice",
        data: generalNotice,
      };
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/create-notice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Notice created successfully');
        // Clear the form based on active tab
        if (activeTab === "createMentorNotice") {
          setMentorNotice({
            teacherName: "",
            email: "",
            heading: "",
            description: "",
          });
        } else if (activeTab === "createEvent") {
          setEventNotice({
            eventName: "",
            hostBy: "",
            contactEmail: "",
            date: "",
            time: "",
            description: "",
          });
        } else if (activeTab === "createNotice") {
          setGeneralNotice({
            heading: "",
            contactEmail: "",
            description: "",
          });
        }
      } else {
        alert(result.message || 'Error creating notice');
      }
    } catch (error) {
      console.error('Error submitting notice:', error);
      alert('Error submitting notice');
    } finally {
      setLoading(false);
    }
  };

  // Render different forms based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "createMentorNotice":
        return (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold">Create Mentor Notice</h2>
            <input
              type="text"
              name="teacherName"
              placeholder="Teacher's Name"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={mentorNotice.teacherName}
              onChange={handleMentorNoticeChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={mentorNotice.email}
              onChange={handleMentorNoticeChange}
              required
            />
            <input
              type="text"
              name="heading"
              placeholder="Notice Heading"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={mentorNotice.heading}
              onChange={handleMentorNoticeChange}
              required
            />
            <textarea
              name="description"
              placeholder="Notice Description"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={mentorNotice.description}
              onChange={handleMentorNoticeChange}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Mentor Notice'}
            </button>
          </form>
        );
      case "createEvent":
        return (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold">Create Event</h2>
            <input
              type="text"
              name="eventName"
              placeholder="Event Name"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={eventNotice.eventName}
              onChange={handleEventChange}
              required
            />
            <input
              type="text"
              name="hostBy"
              placeholder="Hosted By"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={eventNotice.hostBy}
              onChange={handleEventChange}
              required
            />
            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={eventNotice.contactEmail}
              onChange={handleEventChange}
              required
            />
            <input
              type="date"
              name="date"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={eventNotice.date}
              onChange={handleEventChange}
              required
            />
            <input
              type="time"
              name="time"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={eventNotice.time}
              onChange={handleEventChange}
              required
            />
            <textarea
              name="description"
              placeholder="Event Description"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={eventNotice.description}
              onChange={handleEventChange}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Event'}
            </button>
          </form>
        );
      case "createNotice":
        return (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold">Create General Notice</h2>
            <input
              type="text"
              name="heading"
              placeholder="Notice Heading"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={generalNotice.heading}
              onChange={handleGeneralNoticeChange}
              required
            />
            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={generalNotice.contactEmail}
              onChange={handleGeneralNoticeChange}
              required
            />
            <textarea
              name="description"
              placeholder="Notice Description"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none"
              value={generalNotice.description}
              onChange={handleGeneralNoticeChange}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit General Notice'}
            </button>
          </form>
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
            onClick={() => setActiveTab("createMentorNotice")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "createMentorNotice"
                ? "bg-red-600 text-white"
                : "bg-gray-700"
            }`}
          >
            Mentor Notice
          </button>
          <button
            onClick={() => setActiveTab("createEvent")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "createEvent" ? "bg-red-600 text-white" : "bg-gray-700"
            }`}
          >
            Event
          </button>
          <button
            onClick={() => setActiveTab("createNotice")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "createNotice" ? "bg-red-600 text-white" : "bg-gray-700"
            }`}
          >
            General Notice
          </button>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </div>
  );
};

export default TeacherNoticeCreate;

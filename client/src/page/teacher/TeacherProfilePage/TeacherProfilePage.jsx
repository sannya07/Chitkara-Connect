import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection
import profile from "/profile.png"; // Adjust the path for the profile image

const TeacherProfilePage = () => {
  const [teacher, setTeacher] = useState({
    name: "Loading...",
    teacherId: "Loading...",
    gender: "Loading...",
    dob: "Loading...",
    phoneNo: "Loading...",
    email: "Loading...",
    password: "Loading...",
    designation: "teacher",
  });
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Decode JWT token to get teacherId
      fetch(`${apiBaseUrl}/api/post-data-from-token/${token}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          const { teacherId } = data.decoded; // Extract teacherId from the decoded token

          // Fetch teacher details using teacherId
          fetch(`${apiBaseUrl}/api/teacher-details/${teacherId}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error fetching teacher details");
              }
              return response.json();
            })
            .then((teacherData) => {
              console.log(teacherData); // Log to debug the API response
              setTeacher({
                name: teacherData.name || "Not Available",
                teacherId: teacherData.teacherId || "Not Available",
                gender: teacherData.Gender || "Not Available",
                dob: teacherData.Dob || "Not Available",
                phoneNo: teacherData.phoneNo || "Not Available",
                email: teacherData.email || "Not Available",
                password: teacherData.password || "Not Available",
                designation: teacherData.designation || "teacher",
              });
            })
            .catch((error) => {
              console.error("Error fetching teacher details:", error);
              setTeacher({
                name: "Error fetching details",
                teacherId: "N/A",
                gender: "N/A",
                dob: "N/A",
                phoneNo: "N/A",
                email: "N/A",
                password: "N/A",
                designation: "teacher",
              });
            });
        })
        .catch((error) => {
          console.error("Error decoding token:", error);
          setTeacher({
            name: "Error fetching data",
            teacherId: "N/A",
            gender: "N/A",
            dob: "N/A",
            phoneNo: "N/A",
            email: "N/A",
            password: "N/A",
            designation: "teacher",
          });
        });
    }
  }, []);

  const handleLogout = () => {
    // Clear session or JWT token and redirect to login
    localStorage.removeItem("jwtToken");
    navigate("/"); // Redirect to the login page or home
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-12">
      {/* Profile Header */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow-xl rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-6">
              <img
                className="w-32 h-32 rounded-full border-4 border-teal-400 shadow-lg"
                src={profile}
                alt="Profile"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{teacher.name}</h1>
                <p className="text-teal-300">{teacher.email}</p>
                <p className="text-gray-400">Teacher ID: {teacher.teacherId}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-300 transition-all duration-300"
            >
              Logout
            </button>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-400"><strong>Gender:</strong> {teacher.gender}</p>
              <p className="text-gray-400"><strong>Date of Birth:</strong> {teacher.dob}</p>
              <p className="text-gray-400"><strong>Phone Number:</strong> {teacher.phoneNo}</p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400"><strong>Password:</strong> {teacher.password}</p>
              <p className="text-gray-400"><strong>Designation:</strong> {teacher.designation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">© 2024 Chitkara University. All rights reserved.</p>
      </div>
    </div>
  );
};

export default TeacherProfilePage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import profile from "/profile.png"; // Adjust the path for the profile image

const StudentProfilePage = () => {
  const [student, setStudent] = useState({
    name: "Loading...",
    rollNo: "Loading...",
    fatherName: "Loading...",
    motherName: "Loading...",
    gender: "Loading...",
    dob: "Loading...",
    category: "Loading...",
    phoneNo: "Loading...",
    email: "Loading...",
    group: "Loading...",
    designation: "student",
  });

  const navigate = useNavigate(); // Hook for redirection
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Decode JWT token to get RollNo
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
          const { RollNo } = data.decoded; // Get RollNo from the decoded token

          // Now fetch the student details using the RollNo
          fetch(`${apiBaseUrl}/api/student-details/${RollNo}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error fetching student details");
              }
              return response.json();
            })
            .then((studentData) => {
              console.log(studentData); // Log to see the full API response
              setStudent({
                name: studentData.name || "Not Available",
                rollNo: studentData.RollNo || "Not Available",
                fatherName: studentData.FatherName || "Not Available",
                motherName: studentData.MotherName || "Not Available",
                gender: studentData.Gender || "Not Available",
                dob: studentData.Dob || "Not Available",
                category: studentData.Category || "Not Available",
                phoneNo: studentData.phoneNo || "Not Available",
                email: studentData.email || "Not Available",
                group: studentData.group || "Not Available",
                designation: studentData.designation || "student",
              });
            })
            .catch((error) => {
              console.error("Error fetching student details:", error);
              setStudent({
                name: "Error fetching details",
                rollNo: "N/A",
                fatherName: "N/A",
                motherName: "N/A",
                gender: "N/A",
                dob: "N/A",
                category: "N/A",
                phoneNo: "N/A",
                email: "N/A",
                group: "N/A",
                designation: "student",
              });
            });
        })
        .catch((error) => {
          console.error("Error decoding token:", error);
          setStudent({
            name: "Error fetching data",
            rollNo: "N/A",
            fatherName: "N/A",
            motherName: "N/A",
            gender: "N/A",
            dob: "N/A",
            category: "N/A",
            phoneNo: "N/A",
            email: "N/A",
            group: "N/A",
            designation: "student",
          });
        });
    }
  }, []);

  const handleLogout = () => {
    // Clear the user session or JWT token and redirect to the login page
    localStorage.removeItem("jwtToken");
    navigate("/"); // Navigate to login page or home
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
                <h1 className="text-3xl font-bold text-white">{student.name}</h1>
                <p className="text-teal-300">{student.email}</p>
                <p className="text-gray-400">Roll No: {student.rollNo}</p>
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
              <p className="text-gray-400"><strong>Father's Name:</strong> {student.fatherName}</p>
              <p className="text-gray-400"><strong>Mother's Name:</strong> {student.motherName}</p>
              <p className="text-gray-400"><strong>Gender:</strong> {student.gender}</p>
              <p className="text-gray-400"><strong>Date of Birth:</strong> {student.dob}</p>
              <p className="text-gray-400"><strong>Category:</strong> {student.category}</p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400"><strong>Phone Number:</strong> {student.phoneNo}</p>
              <p className="text-gray-400"><strong>Group:</strong> {student.group}</p>
              <p className="text-gray-400"><strong>Designation:</strong> {student.designation}</p>
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

export default StudentProfilePage;

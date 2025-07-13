import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import chitkaraLogo from "/chitkaraLogo.jpeg"; // Adjust the path as needed
import profile from "/profile.png"; // Adjust the path for the profile image

const AdminNavBar = () => {
  const [admin, setAdmin] = useState({
    name: "Loading...",
    email: "",
    adminId: "", // Make sure adminId is in the state
  });
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook for redirection
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetch(`${apiBaseUrl}/api/post-data-from-token/${token}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          // Extract admin data from the decoded object
          const { name, email, adminId } = data.decoded;

          setAdmin({
            name,
            email,
            adminId,
          });
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
          setAdmin({
            name: "Error fetching data",
            email: "",
            adminId: "",
          });
        });
    }
  }, []);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Logout function
  const logout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("jwtToken");

    // Redirect to the login page or home page after logout
    navigate("/"); // Or change it to navigate("/") for the home page
  };

  return (
    <nav className="bg-gray-900 text-gray-200 p-4 shadow-lg border-b border-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Text */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <img
              className="w-12 h-12 md:w-16 md:h-16 rounded-lg"
              src={chitkaraLogo}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex flex-grow justify-center space-x-8">
          <Link to="/admin/home" className="hover:text-[#EB1C24]">Dashboard</Link>
          <Link to="/admin/manage-teachers" className="hover:text-[#EB1C24]">Manage Teachers</Link>
          <Link to="/admin/manage-students" className="hover:text-[#EB1C24]">Manage Students</Link>
          <Link to="/admin/queries" className="hover:text-[#EB1C24]">Queries</Link>
          <Link to="/admin/help" className="hover:text-[#EB1C24]">Help</Link>
        </div>

        {/* Profile and Mobile Menu Button */}
        <div className="relative flex items-center space-x-4">
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              <span className="text-2xl text-[#EB1C24]">☰</span>
            </button>
          </div>
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                className="w-8 h-8 rounded-full border-2 bg-slate-500 border-gray-600"
                src={profile}
                alt="Profile"
              />
              <span className="hidden md:inline-block font-medium">
                {admin.name}
              </span>
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-auto bg-gray-800 rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 text-sm">
                  <p className="font-semibold">{admin.name}</p>
                  <p className="text-gray-400">{admin.email}</p>
                  <p className="text-gray-400">Admin ID: {admin.adminId}</p> {/* Display the Admin ID */}
                </div>
                <div className="border-t border-gray-700"></div>
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-700"
                >
                  View Profile
                </Link>
                <button
                  onClick={logout} // Logout on button click
                  className="block px-4 py-2 text-sm hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 space-y-2 flex flex-col bg-gray-800 justify-center p-5 rounded-md">
          <Link to="/admin/dashboard" className="hover:text-[#EB1C24]">Dashboard</Link>
          <Link to="/admin/manage-teachers" className="hover:text-[#EB1C24]">Manage Teachers</Link>
          <Link to="/admin/manage-students" className="hover:text-[#EB1C24]">Manage Students</Link>
          <Link to="/admin/reports" className="hover:text-[#EB1C24]">Reports</Link>
          <Link to="/admin/settings" className="hover:text-[#EB1C24]">Settings</Link>
          <Link to="/admin/help" className="hover:text-[#EB1C24]">Help</Link>
        </div>
      )}
    </nav>
  );
};

export default AdminNavBar;

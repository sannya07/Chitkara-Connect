import React from "react";
import { Outlet } from "react-router-dom"; // This is for nested routes
import AdminNavBar from "./page/admin/AdminNavbar/AdminNavbar";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavBar/> {/* Admin navigation bar */}
        <Outlet /> {/* Renders nested routes here */}
    </div>
  );
};

export default AdminLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import TeacherNavBar from './page/teacher/TeacherNavBar/TeacherNavBar'

const TeacherLayout = () => {
  return (
    <div>
      <TeacherNavBar />
      <Outlet /> {/* Renders nested routes here */}
    </div>
  );
};

export default TeacherLayout;

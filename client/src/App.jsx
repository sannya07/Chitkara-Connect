import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './page/login/LoginPage'
import StudentHome from './page/student/StudentHome/StudentHome'
import StudentGatepass from './page/student/StudentGatepass/StudentGatepass'
import StudentQueries from './page/student/StudentQueries/StudentQueries'
import TeacherNavBar from './page/teacher/TeacherNavBar/TeacherNavBar'
import TeacherHome from './page/teacher/TeacherHome/TeacherHome'
import TeacherNoticeCreate from './page/teacher/TeacherHome/TeacherNoticeCreate'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentNavBar from './page/student/StudentNavBar/StudentNavBar'
import Footer from './page/footer/Footer'
import StudentPerformance from './page/student/StudentPerformance/StudentPerformance'
import StudentProfilePage from './page/student/StudentProfilePage/StudentProfilePage'
import StudentAttendance from './page/student/StudentAttendance/StudentAttendance'


const App = () => {
  return (
    <Router>
    
      <Routes>
        {/* Default route to login */}
        <Route path="/" element={<LoginPage />} />

        {/* Student routes */}
        <Route path="/student/" element={<StudentNavBar />}>
          <Route path="home" element={<StudentHome />} />
          <Route path="gatepass" element={<StudentGatepass />} />
          <Route path="queries" element={<StudentQueries />} />
          <Route path="performance" element={<StudentPerformance/>} />
          <Route path="attendance" element={<StudentAttendance/>} />
          <Route path="profile" element={<StudentProfilePage/>} />
        </Route>

        {/* Teacher routes */}
        <Route path="/teacher" element={<TeacherNavBar />}>
          <Route path="home" element={<TeacherHome />} />
          <Route path="notice/create" element={<TeacherNoticeCreate />} />
        </Route>
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App

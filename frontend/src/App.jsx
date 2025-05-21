import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';
import Teachers from './pages/Teachers/Teachers';
import Students from './pages/Students/Students';
import StudentReport from './components/TeachersPreStudy/StudentReport';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  return (
    <AntdApp>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/admin/:id" 
            element={<ProtectedRoute element={<Admin />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/teachers/:id" 
            element={<ProtectedRoute element={<Teachers />} allowedRoles={['teacher']} />} 
          />
          <Route 
            path="/students" 
            element={<ProtectedRoute element={<Students />} allowedRoles={['stud']} />} 
          />
          <Route 
            path="/student-report" 
            element={<ProtectedRoute element={<StudentReport />} allowedRoles={['teacher', 'admin']} />} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute element={<UserProfile />} allowedRoles={['admin', 'teacher', 'stud']} />} 
          />
        </Routes>
      </Router>
    </AntdApp>
  );
}

export default App;



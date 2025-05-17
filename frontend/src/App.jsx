import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';
import Teachers from './pages/Teachers/Teachers';
import Students from './pages/Students/Students';
import StudentReport from './components/TeachersPreStudy/StudentReport';
import './App.css';

function App() {
  return (
    <AntdApp>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student-report" element={<StudentReport />} />
        </Routes>
      </Router>
    </AntdApp>
  );
}

export default App;



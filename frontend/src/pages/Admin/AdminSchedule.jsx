import React, { useState } from 'react';
import { Tabs } from 'antd';
import StudentSchedule from '../../components/AdminSchedule/StudentSchedule';
import TeacherSchedule from '../../components/AdminSchedule/TeacherSchedule';
import './AdminSchedule.css';

const AdminSchedule = () => {
  const [activeTab, setActiveTab] = useState('students');

  const items = [
    {
      key: 'students',
      label: 'Расписание студентов',
      children: <StudentSchedule />,
    },
    {
      key: 'teachers',
      label: 'Расписание преподавателей',
      children: <TeacherSchedule />,
    },
  ];

  return (
    <div className="admin-schedule-container">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className="schedule-tabs"
      />
    </div>
  );
};

export default AdminSchedule; 
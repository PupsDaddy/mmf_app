import React, { useState, useEffect } from 'react';
import { Table, Select, Space, Button, Tabs } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './ScheduleTable.css';

const TeacherSchedule = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('winter');
  const [selectedWeek, setSelectedWeek] = useState('1');
  const [scheduleData, setScheduleData] = useState([]);

  // Mock data for dropdowns
  const teachers = [
    { value: '1', label: 'Иванов И.И.' },
    { value: '2', label: 'Петров П.П.' },
    { value: '3', label: 'Сидоров С.С.' },
    { value: '4', label: 'Смирнова А.А.' },
  ];

  const days = [
    { value: '1', label: 'Понедельник' },
    { value: '2', label: 'Вторник' },
    { value: '3', label: 'Среда' },
    { value: '4', label: 'Четверг' },
    { value: '5', label: 'Пятница' },
    { value: '6', label: 'Суббота' },
  ];

  const semesterItems = [
    {
      key: 'winter',
      label: 'Зимний семестр',
    },
    {
      key: 'spring',
      label: 'Весенний семестр',
    },
  ];

  const weekItems = [
    {
      key: '1',
      label: '1 неделя',
    },
    {
      key: '2',
      label: '2 неделя',
    },
  ];

  // Здесь нужно добавить ваш запрос к API
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedTeacher || !selectedWeek) return;

      try {
        const response = await axios.get(`http://127.0.0.1:8000/schedule/`)
        setScheduleData(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule();
  }, [selectedTeacher, selectedWeek, selectedDay, selectedSemester]);

  const renderScheduleCell = (day, pairNumber) => {
    const daySchedule = scheduleData.filter(pair => pair.week_day === parseInt(day));
    const pair = daySchedule.find(p => p.n_class === pairNumber);

    if (!pair) {
      return (
        <div className="schedule-cell empty">
          <div className="add-pair-button">+</div>
        </div>
      );
    }

    return (
      <div className="schedule-cell">
        <div className="schedule-cell-content">
          <div className="pair-number">Пара {pair.n_class}</div>
          <div className="subject">{pair.sub_name}</div>
          <div className="room">Ауд. {pair.class_room}</div>
          <div className="time">{`${pair.start_time.slice(0, 5)} - ${pair.end_time.slice(0, 5)}`}</div>
        </div>
        <Button 
          type="text" 
          className="delete-button"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Delete pair:', day, pairNumber);
          }}
        />
      </div>
    );
  };

  const filteredDays = selectedDay 
    ? days.filter(day => day.value === selectedDay)
    : days;

  const columns = filteredDays.map(day => ({
    title: day.label,
    dataIndex: day.value,
    key: day.value,
    width: selectedDay ? '100%' : '16.66%',
    render: (_, record) => renderScheduleCell(day.value, record.pairNumber)
  }));

  const data = Array.from({ length: 5 }, (_, i) => ({
    key: i + 1,
    pairNumber: i + 1
  }));

  return (
    <div className="schedule-table-container">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Tabs
          items={semesterItems}
          onChange={setSelectedSemester}
          value={selectedSemester}
          className="schedule-tabs"
        />
        <Tabs
          items={weekItems}
          onChange={setSelectedWeek}
          value={selectedWeek}
          className="schedule-tabs"
        />
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Выберите преподавателя"
            options={teachers}
            value={selectedTeacher}
            onChange={setSelectedTeacher}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Выберите день"
            options={days}
            value={selectedDay}
            onChange={setSelectedDay}
            style={{ width: 200 }}
            allowClear
          />
        </Space>
        <Table
          className="schedule-table"
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />
      </Space>
    </div>
  );
};

export default TeacherSchedule; 
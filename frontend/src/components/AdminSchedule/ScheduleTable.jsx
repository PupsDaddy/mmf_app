import React, { useState } from 'react';
import { Table, Select, Space, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './ScheduleTable.css';

const ScheduleTable = ({ semester, week }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Mock data
  const courses = [
    { value: '1', label: '1 курс' },
    { value: '2', label: '2 курс' },
    { value: '3', label: '3 курс' },
    { value: '4', label: '4 курс' },
  ];

  const groups = [
    { value: '1', label: 'Группа 1' },
    { value: '2', label: 'Группа 2' },
    { value: '3', label: 'Группа 3' },
    { value: '4', label: 'Группа 4' },
    { value: '5', label: 'Группа 5' },
  ];

  const days = [
    { value: 'monday', label: 'Понедельник' },
    { value: 'tuesday', label: 'Вторник' },
    { value: 'wednesday', label: 'Среда' },
    { value: 'thursday', label: 'Четверг' },
    { value: 'friday', label: 'Пятница' },
    { value: 'saturday', label: 'Суббота' },
  ];

  // Mock schedule data
  const mockSchedule = {
    monday: [
      {
        pairNumber: 1,
        subject: 'Математика',
        teacher: 'Иванов И.И.',
        room: '301',
        type: 'Лекция',
        time: '8:30 - 10:00'
      },
      {
        pairNumber: 2,
        subject: 'Программирование',
        teacher: 'Петров П.П.',
        room: '402',
        type: 'Практика',
        time: '10:10 - 11:40'
      },
      {
        pairNumber: 3,
        subject: 'Физика',
        teacher: 'Сидоров С.С.',
        room: '503',
        type: 'Лекция',
        time: '12:10 - 13:40'
      },
      {
        pairNumber: 4,
        subject: 'Английский',
        teacher: 'Смирнова А.А.',
        room: '604',
        type: 'Практика',
        time: '14:10 - 15:40'
      }
    ],
    tuesday: [
      {
        pairNumber: 1,
        subject: 'История',
        teacher: 'Козлов К.К.',
        room: '301',
        type: 'Лекция',
        time: '8:30 - 10:00'
      },
      {
        pairNumber: 2,
        subject: 'Химия',
        teacher: 'Новикова Н.Н.',
        room: '402',
        type: 'Практика',
        time: '10:10 - 11:40'
      }
    ],
    wednesday: [
      {
        pairNumber: 1,
        subject: 'Биология',
        teacher: 'Морозов М.М.',
        room: '301',
        type: 'Лекция',
        time: '8:30 - 10:00'
      },
      {
        pairNumber: 2,
        subject: 'География',
        teacher: 'Волков В.В.',
        room: '402',
        type: 'Практика',
        time: '10:10 - 11:40'
      },
      {
        pairNumber: 3,
        subject: 'Литература',
        teacher: 'Соколова С.С.',
        room: '503',
        type: 'Лекция',
        time: '12:10 - 13:40'
      }
    ],
    thursday: [
      {
        pairNumber: 1,
        subject: 'Информатика',
        teacher: 'Лебедев Л.Л.',
        room: '301',
        type: 'Лекция',
        time: '8:30 - 10:00'
      },
      {
        pairNumber: 2,
        subject: 'Экономика',
        teacher: 'Кузнецов К.К.',
        room: '402',
        type: 'Практика',
        time: '10:10 - 11:40'
      },
      {
        pairNumber: 3,
        subject: 'Право',
        teacher: 'Ильин И.И.',
        room: '503',
        type: 'Лекция',
        time: '12:10 - 13:40'
      },
      {
        pairNumber: 4,
        subject: 'Философия',
        teacher: 'Соловьев С.С.',
        room: '604',
        type: 'Практика',
        time: '14:10 - 15:40'
      },
      {
        pairNumber: 5,
        subject: 'Психология',
        teacher: 'Медведева М.М.',
        room: '705',
        type: 'Лекция',
        time: '16:10 - 17:40'
      }
    ],
    friday: [
      {
        pairNumber: 1,
        subject: 'Социология',
        teacher: 'Григорьев Г.Г.',
        room: '301',
        type: 'Лекция',
        time: '8:30 - 10:00'
      },
      {
        pairNumber: 2,
        subject: 'Политология',
        teacher: 'Орлов О.О.',
        room: '402',
        type: 'Практика',
        time: '10:10 - 11:40'
      }
    ],
    saturday: [
      {
        pairNumber: 1,
        subject: 'Экология',
        teacher: 'Титов Т.Т.',
        room: '301',
        type: 'Лекция',
        time: '8:30 - 10:00'
      },
      {
        pairNumber: 2,
        subject: 'Астрономия',
        teacher: 'Зайцев З.З.',
        room: '402',
        type: 'Практика',
        time: '10:10 - 11:40'
      },
      {
        pairNumber: 3,
        subject: 'Геология',
        teacher: 'Романов Р.Р.',
        room: '503',
        type: 'Лекция',
        time: '12:10 - 13:40'
      }
    ]
  };

  const renderScheduleCell = (day, pairNumber) => {
    const daySchedule = mockSchedule[day] || [];
    const pair = daySchedule.find(p => p.pairNumber === pairNumber);

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
          <div className="pair-number">Пара {pair.pairNumber}</div>
          <div className="subject">{pair.subject}</div>
          <div className="teacher">{pair.teacher}</div>
          <div className="room">Ауд. {pair.room}</div>
          <div className="type">{pair.type}</div>
          <div className="time">{pair.time}</div>
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

  // Фильтруем дни в зависимости от выбранного дня
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
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Выберите курс"
          options={courses}
          value={selectedCourse}
          onChange={setSelectedCourse}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Выберите группу"
          options={groups}
          value={selectedGroup}
          onChange={setSelectedGroup}
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
    </div>
  );
};

export default ScheduleTable; 
import React, { useState, useEffect } from 'react';
import { Table, Select, Space, Button, Tabs, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';
import InsertStudentScheduleModal from './InsertStudentScheduleModal';
import './ScheduleTable.css';

const StudentSchedule = () => {
  const [selectedCourse, setSelectedCourse] = useState('1');
  const [selectedGroup, setSelectedGroup] = useState('1');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState('1');
  const [scheduleData, setScheduleData] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [pairToDelete, setPairToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data for dropdowns
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
    { value: '1', label: 'Понедельник' },
    { value: '2', label: 'Вторник' },
    { value: '3', label: 'Среда' },
    { value: '4', label: 'Четверг' },
    { value: '5', label: 'Пятница' },
    { value: '6', label: 'Суббота' },
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

  // Получаем ID группы при изменении курса и номера группы
  useEffect(() => {
    const fetchGroupId = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/groups/${selectedCourse}/${selectedGroup}`);
        console.log(response);
        setGroupId(response.data.group_id);
      } catch (error) {
        console.error('Error fetching group ID:', error);
        setGroupId(null);
      }
    };

    fetchGroupId();
  }, [selectedCourse, selectedGroup]);

  // Получаем расписание при изменении ID группы или недели
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!groupId || !selectedWeek) {
        setScheduleData([]);
        return;
      }

      try {
        console.log('Fetching schedule for group:', groupId, 'week:', selectedWeek);
        const response = await axios.get(`http://127.0.0.1:8000/schedule/${groupId}/${selectedWeek}`);
        console.log('Received schedule data structure:', {
          isArray: Array.isArray(response.data),
          length: response.data.length,
          firstItem: response.data[0] ? {
            keys: Object.keys(response.data[0]),
            values: response.data[0]
          } : null,
          fullData: response.data
        });
        setScheduleData(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setScheduleData([]);
      }
    };

    fetchSchedule();
  }, [groupId, selectedWeek]);

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  const handleDelete = async (pair) => {
    try {
      console.log('Deleting schedule with ID:', pair.schedule_id);
      const deleteResponse = await axios.delete(`http://127.0.0.1:8000/schedule/${pair.schedule_id}`);
      console.log('Delete response:', deleteResponse);

      // Перезагружаем данные после удаления
      console.log('Reloading schedule for group:', groupId, 'week:', selectedWeek);
      const response = await axios.get(`http://127.0.0.1:8000/schedule/${groupId}/${selectedWeek}`);
      console.log('New schedule data:', response.data);
      setScheduleData(response.data);
    } catch (error) {
      console.error('Error in delete operation:', error);
      Modal.error({
        title: 'Ошибка при удалении',
        content: 'Не удалось удалить пару. Пожалуйста, попробуйте снова.',
      });
    }
  };

  const handleAdd = (newData) => {
    setScheduleData([...scheduleData, newData]);
  };

  const renderScheduleCell = (day, pairNumber) => {
    const daySchedule = scheduleData.filter(pair => pair.week_day === parseInt(day));
    const pair = daySchedule.find(p => p.n_class === pairNumber);

    if (!pair) {
      return (
        <div className="schedule-cell empty">
          <div style={{ position: 'absolute', top: 5, left: 5, fontWeight: 'bold' }}>
            {`Пара ${pairNumber}`}
          </div>
          <Button 
            className="add-pair-button" 
            onClick={() => setIsModalVisible(true)}
          >
            +
          </Button>
        </div>
      );
    }

    return (
      <div className="schedule-cell" data-id={pair.schedule_id}>
        <div className="schedule-cell-content">
          <div className="pair-number">№{pair.n_class}</div>
          <div className="subject">{`${pair.sub_name} | ${pair.class_type}${pair.sub_group ? ` | ${pair.sub_group}` : ''}`}</div>
          <div className="teacher">{`${pair.teacher_surname} ${pair.teacher_name[0]}.${pair.teacher_father_name[0]}.`}</div>
          <div className="room">Ауд. <strong>{pair.class_room}</strong></div>
          <div className="time">{`${pair.start_time.slice(0, 5)} - ${pair.end_time.slice(0, 5)}`}</div>
        </div>
        <Button 
          type="text" 
          className="delete-button"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            const cell = e.currentTarget.closest('.schedule-cell');
            const scheduleId = cell.getAttribute('data-id');
            console.log('Deleting pair with schedule_id:', scheduleId);
            setPairToDelete({ ...pair, schedule_id: scheduleId });
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
          items={weekItems}
          onChange={handleWeekChange}
          value={selectedWeek}
          className="schedule-tabs"
        />
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
      </Space>
      {pairToDelete && (
        <DeleteConfirmModal
          pair={pairToDelete}
          onConfirm={() => {
            handleDelete(pairToDelete);
            setPairToDelete(null);
          }}
        />
      )}
      <InsertStudentScheduleModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default StudentSchedule; 
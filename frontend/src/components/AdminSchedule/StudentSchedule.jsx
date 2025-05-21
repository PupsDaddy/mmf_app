import React, { useState, useEffect } from 'react';
import { Table, Select, Space, Button, Tabs, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
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
  const [pairsToDelete, setPairsToDelete] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedPair, setSelectedPair] = useState(null);
  const [curse, setCurse] = useState(1);
  const [group_number, setGroupNumber] = useState(5);
  const [selectedClass, setSelectedClass] = useState(null);

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

  useEffect(() => {
    fetchSchedule();
  }, [groupId, selectedWeek]);

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  const deletePair = async (scheduleId) => {
    try {
      console.log('Deleting schedule with ID:', scheduleId);
      await axios.delete(`http://127.0.0.1:8000/schedule/${scheduleId}`);
      return true; // Return true if deletion is successful
    } catch (error) {
      console.error('Error in delete operation:', error);
      Modal.error({
        title: 'Ошибка при удалении',
        content: 'Не удалось удалить пару. Пожалуйста, попробуйте снова.',
      });
      return false; // Return false if there was an error
    }
  };

  const handleDelete = (pair) => {
    const daySchedule = scheduleData.filter(p => p.week_day === pair.week_day && p.n_class === pair.n_class);
    
    if (daySchedule.length > 1) {
      setPairsToDelete(daySchedule);
      setIsDeleteModalVisible(true);
    } else {
      deletePair(daySchedule[0].schedule_id); // Directly delete if only one class
    }
  };

  const handleAdd = async (newData) => {
    console.log('Добавление расписания:', newData);
  
    const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    const weekDayIndex = weekDays.indexOf(selectedDay) + 1;
  
    if (weekDayIndex === 0) {
      console.error('Invalid selected day:', selectedDay);
      Modal.error({
        title: 'Ошибка',
        content: 'Выберите корректный день недели',
      });
      return;
    }
  
    const payload = {
      ...newData,
      week_day: weekDayIndex,
      group_id: groupId,
      week_number: selectedWeek
    };
  
    try {
      // Добавляем индикатор загрузки
      setIsModalVisible(false); // Сразу закрываем модальное окно
      
      const response = await axios.post('http://127.0.0.1:8000/schedule', payload);
      console.log('Успешно добавлено:', response.data);
      
      // Форсированное обновление данных
      await fetchSchedule();
      
      // Показываем уведомление об успехе
      Modal.success({
        title: 'Успех',
        content: 'Пара успешно добавлена в расписание',
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
      Modal.error({
        title: 'Ошибка при добавлении',
        content: error.response?.data?.message || 'Не удалось добавить пару. Пожалуйста, попробуйте снова.',
      });
    }
  };

  const openModal = (n_class) => {
    setSelectedClass(n_class); // Устанавливаем номер ячейки
    setIsModalVisible(true);
  };

  const renderScheduleCell = (day, pairNumber) => {
    // Группируем пары по week_day и n_class
    const daySchedule = scheduleData.filter(pair => pair.week_day === parseInt(day) && pair.n_class === pairNumber);

    return (
      <div className="schedule-cell" data-id={daySchedule[0]?.schedule_id}>
        <div className="schedule-cell-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', height: '100%' }}>
          {daySchedule.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                {daySchedule.map((pair, index) => (
                  <div key={index} style={{ flex: 1, margin: '0 4px', minWidth: '100px' }}>
          <div className="pair-number">№{pair.n_class}</div>
          <div className="subject">{`${pair.sub_name} | ${pair.class_type}${pair.sub_group ? ` | ${pair.sub_group}` : ''}`}</div>
          <div className="teacher">{`${pair.teacher_surname} ${pair.teacher_name[0]}.${pair.teacher_father_name[0]}.`}</div>
          <div className="room">Ауд. <strong>{pair.class_room}</strong></div>
          <div className="time">{`${pair.start_time.slice(0, 5)} - ${pair.end_time.slice(0, 5)}`}</div>
        </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <Button 
                  className="add-pair-button" 
                  onClick={() => openModal(pairNumber)} // Открываем модал для добавления
                  style={{ fontSize: '10px', borderRadius: '2px', padding: '2px 4px' }} // Уменьшаем размер кнопки
                >
                  +
                </Button>
        <Button 
          type="text" 
          className="delete-button"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
                    const scheduleId = daySchedule[0]?.schedule_id; // Используем ID первой пары для удаления
            console.log('Deleting pair with schedule_id:', scheduleId);
                    setPairsToDelete(daySchedule); // Set pairs to delete
                    setIsDeleteModalVisible(true); // Open the delete modal
          }}
        />
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button 
                className="add-pair-button" 
                onClick={() => openModal(pairNumber)}
                style={{ fontSize: '16px', borderRadius: '4px', padding: '4px 8px' }} // Увеличиваем размер кнопки
              >
                +
              </Button>
            </div>
          )}
        </div>
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

  // Логика модала подтверждения удаления
  const handleConfirmDelete = async () => {
    if (selectedPair) {
      const success = await deletePair(selectedPair);
      if (success) {
        await fetchSchedule(); // Обновляем расписание после удаления
        setIsDeleteModalVisible(false); // Закрываем модал, если удаление прошло успешно
      }
    }
  };

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
      {isDeleteModalVisible && (
        <Modal
          title="Выберите пару для удаления"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalVisible(false);
            setPairsToDelete([]); // Очищаем пары на отмену
          }}
        >
          <Select
            placeholder="Выберите пару для удаления"
            style={{ width: '100%' }}
            onChange={(value) => {
              setSelectedPair(value);
              console.log('Выбранный schedule_id:', value);
            }}
          >
            {pairsToDelete.map(pair => (
              <Select.Option key={pair.schedule_id} value={pair.schedule_id}>
                {`${pair.sub_name} | ${pair.class_type} | ${pair.sub_group}`}
              </Select.Option>
            ))}
          </Select>
        </Modal>
      )}
      <InsertStudentScheduleModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAdd}
        curse={selectedCourse}
        group_number={selectedGroup}
        n_class={selectedClass}
        group_id={groupId}
      />
    </div>
  );
};

export default StudentSchedule; 


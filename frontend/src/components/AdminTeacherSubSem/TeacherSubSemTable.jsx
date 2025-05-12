import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Button, Space, Modal } from 'antd';
import axios from 'axios';
import './TeacherSubSemTable.css';

const departmentMap = {
  'БН': 'Био-наномеханика',
  'ВТиКМ': 'Веб-Технологиии и компьютерное моделирование',
  'ВАиЗИ': 'Высшая алгебра и защита информации',
  'ГТиМПМ': 'Геометрия, топология и методика преподавания математики',
  'ДУиСА': 'Дифференциальные уравнения и системный анализ',
  'ИММ': 'Искуственные методы моделирования',
  'ТиПМ': 'Теоретическая и прикладная механика',
  'ТФ': 'Теория функций'
};

const positionOptions = [
  'Доцент',
  'Профессор',
  'Ассистент',
  'Декан',
  'Старший преподаватель',
  'Заведующий кафедрой'
];

const departmentOptions = Object.entries(departmentMap).map(([value, label]) => ({ value, label }));

const TeacherSubSemTable = ({ refreshTrigger }) => {
  const [subFilterAttr, setSubFilterAttr] = useState('sub_name');
  const [teachersList, setTeachersList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [subSemList, setSubSemList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [academicData, setAcademicData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState(null);
  const [positionFilter, setPositionFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalDepartmentFilter, setModalDepartmentFilter] = useState(null);
  const [modalPositionFilter, setModalPositionFilter] = useState(null);
  const [modalTeachers, setModalTeachers] = useState([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Получаем основные данные
        const response1 = await axios.get('http://127.0.0.1:8000/teachers_subjects_semester/all');
        const teacher_sub_sem_data = response1.data;
        
        // 2. Формируем ID для следующих запросов
        const teacherIds = [...new Set(teacher_sub_sem_data
          .filter(el => el.teacher_id !== null)
          .map(el => el.teacher_id))].join(',');
        const subSemIds = [...new Set(teacher_sub_sem_data
          .filter(el => el.sub_semester_id !== null)
          .map(el => el.sub_semester_id))].join(',');
        const groupIds = [...new Set(teacher_sub_sem_data
          .filter(el => el.group_id !== null)
          .map(el => el.group_id))].join(',');
        
        // 3. Параллельно получаем преподавателей, предметы-семестры и группы
        const [teachersResponse, subSemResponse, groupsResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/teachers/?ids=${teacherIds}`),
          axios.get(`http://127.0.0.1:8000/subjects_semester/?ids=${subSemIds}`),
          axios.get(`http://127.0.0.1:8000/groups/?ids=${groupIds}`)
        ]);

        // 4. Получаем ID предметов из subSemResponse
        const subIds = [...new Set(subSemResponse.data
          .filter(el => el.sub_id !== null)
          .map(el => el.sub_id))].join(',');
        
        // 5. Получаем данные о предметах
        const subjectsResponse = await axios.get(`http://127.0.0.1:8000/subjects/?ids=${subIds}`);

        // 6. Обновляем состояние
        setAcademicData(teacher_sub_sem_data);
        setTeachersList(teachersResponse.data);
        setSubSemList(subSemResponse.data);
        setSubjectsList(subjectsResponse.data);
        setGroupsList(groupsResponse.data);
        
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchAllData();
  }, [refreshTrigger]);

  // Функции для поиска связанных данных
  const getTeacherById = (id) => teachersList.find(teacher => teacher.id === id) || {};
  const getSubSemById = (id) => subSemList.find(subSem => subSem.id === id) || {};
  const getSubjectById = (id) => subjectsList.find(sub => sub.id === id) || {};
  const getGroupById = (id) => groupsList.find(group => group.id === id) || {};

  // Подготовка данных для таблицы
  const dataSource = academicData.map(item => {
    const teacher = getTeacherById(item.teacher_id);
    const subSem = getSubSemById(item.sub_semester_id);
    const subject = getSubjectById(subSem.sub_id);
    const group = getGroupById(item.group_id);
    
    return {
      ...item,
      teacher_data: teacher,
      sub_sem_data: subSem,
      subject_data: subject,
      group_data: group
    };
  });

  const subjectFilterOptions = [
    { value: 'sub_name', label: 'Название предмета' }
  ];

  // Получаем уникальные значения для фильтров из данных
  const classTypeOptions = [...new Set(academicData.map(item => item.class_type))]
    .filter(Boolean)
    .map(type => ({
      text: type === 'L' ? 'Лекция' : 'Практика',
      value: type
    }));

  const subGroupOptions = [...new Set(academicData.map(item => item.sub_group || '-'))]
    .filter(Boolean)
    .map(group => ({
      text: group === '-' ? 'Нет' : group,
      value: group
    }));

  // Получаем уникальные семестры для фильтрации
  const semesterOptions = [...new Set(academicData.map(item => item.sub_sem_data?.semester))]
    .filter(Boolean)
    .sort((a, b) => a - b)
    .map(sem => ({
      text: `${sem} семестр`,
      value: sem
    }));

  // Получаем уникальные значения для фильтров
  const courseOptions = [...new Set(groupsList.map(group => group.curse))]
    .sort((a, b) => a - b)
    .map(course => ({
      text: `${course} курс`,
      value: course
    }));

  const groupNumberOptions = [...new Set(groupsList.map(group => group.number))]
    .sort((a, b) => a - b)
    .map(number => ({
      text: `Группа ${number}`,
      value: number
    }));

  const specialityOptions = [...new Set(groupsList.map(group => group.speciality))]
    .map(speciality => ({
      text: speciality,
      value: speciality
    }));

  const filteredData = dataSource.filter(item => {
    let depOk = true;
    let posOk = true;
    if (departmentFilter) depOk = item.teacher_data.department === departmentFilter;
    if (positionFilter) posOk = item.teacher_data.teacher_position === positionFilter;
    return depOk && posOk;
  });

  const fetchFilteredTeachers = async (department, position) => {
    setIsModalLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/teachers/filter/${department || 'none'}/${position || 'none'}`);
      setModalTeachers(response.data);
    } catch (error) {
      console.error('Error fetching filtered teachers:', error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleTeacherChange = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
    // Загружаем преподавателей при открытии модального окна
    fetchFilteredTeachers(modalDepartmentFilter, modalPositionFilter);
  };

  const handleModalFilterChange = (type, value) => {
    if (type === 'department') {
      setModalDepartmentFilter(value);
      fetchFilteredTeachers(value, modalPositionFilter);
    } else if (type === 'position') {
      setModalPositionFilter(value);
      fetchFilteredTeachers(modalDepartmentFilter, value);
    }
  };

  const handleModalOk = async (selectedTeacherId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/teachers_subjects_semester/${selectedRecord.id}`, {
        teacher_id: selectedTeacherId
      });
      setIsModalVisible(false);
      // Обновляем данные после изменения
      const response = await axios.get('http://127.0.0.1:8000/teachers_subjects_semester/all');
      setAcademicData(response.data);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const columns = [
    {
      title: 'Преподаватель',
      key: 'teacher_id',
      render: (_, record) => {
        const teacher = record.teacher_data;
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {teacher ? (
                <>
                  <div>{teacher.teacher_surname} {teacher.teacher_name?.[0]}.{teacher.teacher_father_name?.[0]}.</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{teacher.teacher_position}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{teacher.department}</div>
                </>
              ) : (
                <div style={{ color: '#888' }}>...</div>
              )}
            </div>
            <Button 
              type="link" 
              onClick={() => handleTeacherChange(record)}
              style={{ marginLeft: 8 }}
            >
              Изменить
            </Button>
          </div>
        );
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8, width: 250 }}>
          <Input
            placeholder="Введите фамилию преподавателя"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => { clearFilters?.(); confirm({ closeDropdown: true }); }} size="small">
              Сбросить
            </Button>
            <Button type="primary" onClick={() => confirm({ closeDropdown: true })} size="small">
              Применить
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        return String(record.teacher_data.teacher_surname).toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    {
      title: 'Предмет',
      key: 'sub_semester_id',
      render: (_, record) => (
        <div>
          <div>{record.subject_data.sub_name}</div>
          <div>Семестр: {record.sub_sem_data.semester}</div>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8, width: 250 }}>
          <Select
            style={{ width: '100%' }}
            value={subFilterAttr}
            onChange={value => {
              setSubFilterAttr(value);
              setSelectedKeys([]);
            }}
            options={subjectFilterOptions}
          />
          <Input
            placeholder={`Введите название предмета`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => { clearFilters?.(); confirm({ closeDropdown: true }); }} size="small">
              Сбросить
            </Button>
            <Button type="primary" onClick={() => confirm({ closeDropdown: true })} size="small">
              Применить
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (typeof value === 'string') {
          return String(record.subject_data[subFilterAttr]).toLowerCase()
            .includes(value.toLowerCase());
        } else {
          return record.sub_sem_data.semester === value;
        }
      },
      filters: semesterOptions
    },
    {
      title: 'Группа',
      key: 'group_id',
      render: (_, record) => {
        const group = record.group_data;
        return (
          <div>
            <div>{group.curse} курс, Группа {group.number}</div>
            <div>Специальность: {group.speciality}</div>
            <div>Подгруппа: <span style={{ fontWeight: 600 }}>{record.sub_group || '-'}</span></div>
          </div>
        );
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8, width: 250 }}>
          <Select
            style={{ width: '100%' }}
            placeholder="Фильтр по курсу"
            options={courseOptions}
            onChange={value => setSelectedKeys([{ type: 'course', value }])}
            allowClear
          />
          <Select
            style={{ width: '100%' }}
            placeholder="Фильтр по номеру группы"
            options={groupNumberOptions}
            onChange={value => setSelectedKeys([{ type: 'number', value }])}
            allowClear
          />
          <Select
            style={{ width: '100%' }}
            placeholder="Фильтр по специальности"
            options={specialityOptions}
            onChange={value => setSelectedKeys([{ type: 'speciality', value }])}
            allowClear
          />
          <Select
            style={{ width: '100%' }}
            placeholder="Фильтр по подгруппе"
            options={subGroupOptions}
            onChange={value => setSelectedKeys([{ type: 'sub_group', value }])}
            allowClear
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => { clearFilters?.(); confirm({ closeDropdown: true }); }} size="small">
              Сбросить
            </Button>
            <Button type="primary" onClick={() => confirm({ closeDropdown: true })} size="small">
              Применить
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        const group = record.group_data;
        if (!group) return false;
        
        switch (value.type) {
          case 'course':
            return group.curse === value.value;
          case 'number':
            return group.number === value.value;
          case 'speciality':
            return group.speciality === value.value;
          case 'sub_group':
            return record.sub_group === value.value;
          default:
            return false;
        }
      }
    },
    {
      title: 'Тип занятия',
      dataIndex: 'class_type',
      key: 'class_type',
      filters: classTypeOptions,
      onFilter: (value, record) => record.class_type === value,
      render: type => (
        <span style={{ fontWeight: 500 }}>
          {type === 'L' ? 'Лекция' : 'Практика'}
        </span>
      )
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Кафедра"
          options={departmentOptions}
          value={departmentFilter}
          onChange={setDepartmentFilter}
          style={{ width: 250 }}
        />
        <Select
          allowClear
          placeholder="Должность"
          options={positionOptions.map(p => ({ value: p, label: p }))}
          value={positionFilter}
          onChange={setPositionFilter}
          style={{ width: 200 }}
        />
      </Space>
      <Table 
        dataSource={filteredData}
        columns={columns} 
        rowKey="id"
        bordered
        size='large'
        scroll={{ x: true }}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 10,
          align: "center",
          position: ['bottomCenter'],
          defaultCurrent: 1,
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }}
        style={{ 
          background: '#fff', 
          borderRadius: 8, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        className="teacher-sub-sem-table"
      />

      <Modal
        title="Изменить преподавателя"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Select
              allowClear
              placeholder="Кафедра"
              options={departmentOptions}
              value={modalDepartmentFilter}
              onChange={(value) => handleModalFilterChange('department', value)}
              style={{ width: 250 }}
            />
            <Select
              allowClear
              placeholder="Должность"
              options={positionOptions.map(p => ({ value: p, label: p }))}
              value={modalPositionFilter}
              onChange={(value) => handleModalFilterChange('position', value)}
              style={{ width: 200 }}
            />
          </Space>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {isModalLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
          ) : (
            <Table
              dataSource={modalTeachers}
              columns={[
                {
                  title: 'ФИО',
                  dataIndex: 'teacher_surname',
                  key: 'teacher_surname',
                  render: (_, record) => (
                    <Button
                      type="text"
                      style={{ textAlign: 'left', padding: 0 }}
                      onClick={() => handleModalOk(record.id)}
                    >
                      {`${record.teacher_surname} ${record.teacher_name?.[0]}.${record.teacher_father_name?.[0]}.`}
                    </Button>
                  )
                }
              ]}
              pagination={false}
              size="small"
              rowKey="id"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TeacherSubSemTable;





import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Button, message } from 'antd';
import axios from 'axios';
import './SubSemTable.css';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const SubSemTable = ({ refreshTrigger }) => {

  const [subFilterAttr, setSubFilterAttr] = useState('sub_name');
  const [planFilterAttr, setPlanFilterAttr] = useState('speciality');
  const [subjectsList, setSubjectsList]  = useState([]);
  const [plansList, setPlansList]  = useState([]);
  const [academicData, setAcademicData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {

        const response1 = await axios.get('http://127.0.0.1:8000/subjects_semester/all');
        const sub_sem_data = response1.data;
        

        const subIds = [...new Set(sub_sem_data.map(el => el.sub_id))].join(',');
        const planIds = [...new Set(sub_sem_data.map(el => el.plan_id))].join(',');
        
   
        const [subjectsResponse, plansResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/subjects/?ids=${subIds}`),
          axios.get(`http://127.0.0.1:8000/syllabuses/?ids=${planIds}`)
        ]);


        setAcademicData(sub_sem_data);
        setSubjectsList(subjectsResponse.data);
        setPlansList(plansResponse.data);
        
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchAllData();
  }, [refreshTrigger]);


  const getSubjectById = (id) => subjectsList.find(sub => sub.id === id) || {};
  const getPlanById = (id) => plansList.find(plan => plan.id === id) || {};


  const dataSource = academicData.map(item => ({
    ...item,
    sub_data: getSubjectById(item.sub_id),
    plan_data: getPlanById(item.plan_id)
  }));


  const subjectFilterOptions = [
    { value: 'sub_name', label: 'Название предмета' }
  ];

  const planFilterOptions = [
    { value: 'speciality', label: 'Специальность' },
    { value: 'start_year', label: 'Год начала' }
  ];

  const semesterOptions = [...new Set(academicData.map(item => item.semester))]
    .sort()
    .map(sem => ({ text: `${sem}`, value: sem }));

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsModalVisible(true);
    setErrorMessage('');
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://0.0.0.0:8000/subjects_semester/${deleteId}`);
      message.success('Запись успешно удалена');
      setAcademicData(prevData => prevData.filter(item => item.id !== deleteId));
      setIsModalVisible(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage('Запись не найдена');
        } else if (error.response.status === 409) {
          setErrorMessage(error.response.data.detail);
        } else {
          setErrorMessage('Не удалось удалить запись');
        }
      } else {
        setErrorMessage('Не удалось подключиться к серверу');
      }
    }
  };

  const columns = [
    {
      title: 'Предмет',
      key: 'sub_id',
      render: (_, record) => (
        <div>
          <div>{record.sub_data.sub_name}</div>
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
        return String(record.sub_data[subFilterAttr]).toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    {
      title: 'Семестр',
      dataIndex: 'semester',
      key: 'semester',
      sorter: (a, b) => a.semester - b.semester,
      filters: semesterOptions,
      align: 'center',
      onFilter: (value, record) => record.semester === value,
      render: sem => <span style={{ fontWeight: 500 }}>{sem}</span>
    },
    {
      title: 'Аттестация',
      key: 'attestation',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 ,flexDirection: 'column'}}>
          {record.has_zachet && <span >Зачёт</span>}
          {record.has_exam && <span>Экзамен</span>}
          {!record.has_zachet && !record.has_exam && <span>-</span>}
        </div>
      )
    },
    {
      title: 'Часы',
      key: 'hours',
      render: (_, record) => (
        <div>
          <div>Лекции: <strong>{record.lecture_per_week}</strong></div>
          <div>Практика: <strong>{record.practice_per_week}</strong></div>
        </div>
      )
    },
    {
      title: 'Подгруппы',
      dataIndex: 'has_sub_group',
      key: 'has_sub_group',
      render: has => (
        <span style={{ color: has ? '#52c41a' : '#f5222d' }}>
          {has ? 'Да' : 'Нет'}
        </span>
      ),
      filters: [
        { text: 'Да', value: true },
        { text: 'Нет', value: false }
      ],
      onFilter: (value, record) => record.has_sub_group === value
    },
    {
      title: 'Учебный план',
      key: 'plan_id',
      render: (_, record) => (
        <div>
          <div>Специальность: <strong>{record.plan_data.speciality}</strong></div>
          <div>Год: {record.plan_data.start_year}</div>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8, width: 250 }}>
          <Select
            style={{ width: '100%' }}
            value={planFilterAttr}
            onChange={value => {
              setPlanFilterAttr(value);
              setSelectedKeys([]);
            }}
            options={planFilterOptions}
          />
          <Input
            placeholder={`Введите ${planFilterOptions.find(a => a.value === planFilterAttr)?.label.toLowerCase()}`}
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
        return String(record.plan_data[planFilterAttr]).toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Button 
          className="red-button"
          onClick={() => handleDelete(record.id)}
        >
          Удалить
        </Button>
      )
    }
  ];

  return (
    <div>
      <Table
        dataSource={dataSource}
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
        className="custom-table"
      />
      <ConfirmDeleteModal 
        visible={isModalVisible} 
        onConfirm={confirmDelete} 
        onCancel={() => setIsModalVisible(false)} 
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default SubSemTable;





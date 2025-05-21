import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Descriptions, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TeacherProfile.css';

const { Title } = Typography;

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

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/teachers/${id}`);
        setTeacher(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных преподавателя:', error);
        message.error('Не удалось загрузить данные преподавателя');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacherData();
    }
  }, [id]);

  const getFullDepartmentName = (shortName) => {
    return departmentMap[shortName] || shortName;
  };

  if (loading) {
    return (
      <div className="teacher-profile-loading">
        <Spin size="large" />
        <p>Загрузка данных преподавателя...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="teacher-profile-error">
        <Title level={3}>Данные преподавателя не найдены</Title>
      </div>
    );
  }

  return (
    <div className="teacher-profile-container">
      <Card className="teacher-profile-card">
        <div className="teacher-profile-header">
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            className="teacher-avatar" 
          />
          <div className="teacher-name">
            <Title level={2}>
              {teacher.teacher_surname} {teacher.teacher_name} {teacher.teacher_father_name}
            </Title>
            <Title level={4} type="secondary">
              {teacher.teacher_position}
            </Title>
          </div>
        </div>

        <Descriptions 
          title="Информация о преподавателе" 
          bordered 
          column={1}
          className="teacher-descriptions"
        >
          <Descriptions.Item label="Фамилия">{teacher.teacher_surname}</Descriptions.Item>
          <Descriptions.Item label="Имя">{teacher.teacher_name}</Descriptions.Item>
          <Descriptions.Item label="Отчество">{teacher.teacher_father_name}</Descriptions.Item>
          <Descriptions.Item label="Должность">{teacher.teacher_position}</Descriptions.Item>
          <Descriptions.Item label="Кафедра">
            {getFullDepartmentName(teacher.department)} ({teacher.department})
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default TeacherProfile; 
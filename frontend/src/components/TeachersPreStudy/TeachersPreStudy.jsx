import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Empty, Typography, Card, Tag, Space, message } from 'antd';
import { BookOutlined, FileTextOutlined, FormOutlined } from '@ant-design/icons';
import axios from 'axios';
import './TeachersPreStudy.css';

const { Title, Text } = Typography;

const TeachersPreStudy = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Получаем ID преподавателя из URL

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://0.0.0.0:8000/teachers_subjects_semester/${id}`);
                setSubjects(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке дисциплин:', error);
                message.error('Не удалось загрузить список дисциплин');
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSubjects();
        }
    }, [id]);

    // Группируем предметы по курсам
    const groupedSubjects = subjects.reduce((acc, subject) => {
        const course = subject.curse || 'Неизвестный курс';
        if (!acc[course]) {
            acc[course] = [];
        }
        acc[course].push(subject);
        return acc;
    }, {});

    const handleSubjectClick = (subject) => {
        navigate('/student-report', { state: { 
            tssId: subject.tss_id,
            sub_name: subject.sub_name,
            class_type: subject.class_type,
            number: subject.number,
            curse: subject.curse,
            speciality: subject.speciality
        }});
    };

    if (loading) {
        return (
            <div className="teachers-pre-study-loading">
                <Spin size="large" />
                <Text>Загрузка дисциплин...</Text>
            </div>
        );
    }

    if (subjects.length === 0) {
        return (
            <div className="teachers-pre-study-empty">
                <Empty 
                    description="Нет доступных дисциплин" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                />
            </div>
        );
    }

    return (
        <div className="teachers-pre-study">
            <Title level={2}>Мои дисциплины</Title>
            
            {Object.keys(groupedSubjects).sort().map(course => (
                <div key={course} className="course-section">
                    <Title level={3} className="course-title">
                        <BookOutlined /> Курс {course}
                    </Title>
                    <div className="subjects-container">
                        {groupedSubjects[course].map((subject) => (
                            <Card 
                                className="subject-card" 
                                key={subject.tss_id} 
                                onClick={() => handleSubjectClick(subject)}
                                hoverable
                            >
                                <div className="subject-header">
                                    <Text strong>{subject.sub_name}</Text>
                                    <Tag color={subject.class_type === 'L' ? 'green' : 'blue'}>
                                        {subject.class_type === 'L' ? 'Лекция' : 'Практика'}
                                    </Tag>
                                </div>
                                
                                <div className="subject-details">
                                    <Text>{subject.speciality} {subject.number} гр.</Text>
                                    {subject.sub_group && (
                                        <Tag color="orange">Подгруппа {subject.sub_group}</Tag>
                                    )}
                                </div>
                                
                                <Space className="subject-footer">
                                    {subject.has_zachet && (
                                        <Tag icon={<FileTextOutlined />} color="cyan">Зачет</Tag>
                                    )}
                                    {subject.has_exam && (
                                        <Tag icon={<FormOutlined />} color="purple">Экзамен</Tag>
                                    )}
                                </Space>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeachersPreStudy;

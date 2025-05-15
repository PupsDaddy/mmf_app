import React, { useState } from 'react';
import './TeachersPreStudy.css';

const TeachersPreStudy = () => {
    const [tssId, setTssId] = useState('');
    const [subjects, setSubjects] = useState([]);

    const fetchSubjects = async () => {
        const response = await fetch(`http://0.0.0.0:8000/teachers_subjects_semester/${tssId}`);
        const data = await response.json();
        setSubjects(data); // Предполагаем, что data - это массив предметов
    };

    // Группируем предметы по курсам
    const groupedSubjects = subjects.reduce((acc, subject) => {
        const course = subject.curse; // Предполагаем, что поле "curse" указывает на курс
        if (!acc[course]) {
            acc[course] = [];
        }
        acc[course].push(subject);
        return acc;
    }, {});

    return (
        <div className="teachers-pre-study">
            <input 
                type="text" 
                value={tssId} 
                onChange={(e) => setTssId(e.target.value)} 
                placeholder="Введите tss_id" 
            />
            <button onClick={fetchSubjects}>Получить Дисциплины</button>
            {subjects.length === 0 ? ( // Проверяем, есть ли предметы
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>
                    НЕТ ДИСЦИПЛИН
                </div>
            ) : (
                Object.keys(groupedSubjects).map(course => (
                    <div key={course}>
                        <div className="course-title">Курс {course}</div>
                        <div className="subjects-container">
                            {groupedSubjects[course].map((subject) => (
                                <div className="subject-button" key={subject.tss_id}>
                                    <div>{subject.sub_name} | {subject.class_type} | {subject.sub_group}</div>
                                    <div>{subject.speciality} {subject.number} гр. {subject.has_zachet ? 'Зачет' : 'Нет Зачета'} | {subject.has_exam ? 'Экзамен' : 'Нет Экзамена'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TeachersPreStudy;

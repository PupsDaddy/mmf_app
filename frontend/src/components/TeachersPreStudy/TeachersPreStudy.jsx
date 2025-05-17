import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeachersPreStudy.css';

const TeachersPreStudy = () => {
    const [tssId, setTssId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

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

    const handleSubjectClick = (subject) => {
        navigate('/student-report', { state: { 
            tssId: subject.tss_id,
            sub_name: subject.sub_name,
            class_type: subject.class_type,
            number: subject.number,
            curse: subject.curse,
            speciality: subject.speciality
        }}); // Передаем данные в StudentReport
    };

    return (
        <div className="teachers-pre-study">
            <input 
                type="text" 
                value={tssId} 
                onChange={(e) => setTssId(e.target.value)} 
                placeholder="Введите tss_id" 
            />
            <button onClick={fetchSubjects}>Получить Дисциплины</button>
            {subjects.length === 0 ? (
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>
                    НЕТ ДИСЦИПЛИН
                </div>
            ) : (
                Object.keys(groupedSubjects).map(course => (
                    <div key={course}>
                        <div className="course-title">Курс {course}</div>
                        <div className="subjects-container">
                            {groupedSubjects[course].map((subject) => (
                                <div 
                                    className="subject-button" 
                                    key={subject.tss_id} 
                                    onClick={() => handleSubjectClick(subject)} // Передаем весь объект subject
                                >
                                    <div>
                                        {subject.sub_name} | {subject.class_type} | {subject.sub_group}
                                    </div>
                                    <div>
                                        {subject.speciality} {subject.number} гр. 
                                        {subject.has_zachet && ` Зачет`} 
                                        {subject.has_exam && ` Экзамен`}
                                        {subject.has_zachet && subject.has_exam && ' |'}
                                        {!subject.has_zachet && !subject.has_exam && ' (нет информации)'}
                                    </div>
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

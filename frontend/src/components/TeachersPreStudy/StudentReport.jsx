import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, Input, Alert } from 'antd';
import './TeachersPreStudy.css';

const StudentReport = () => {
    const location = useLocation();
    const { tssId, sub_name, class_type, number, curse, speciality } = location.state || {};
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [classDate, setClassDate] = useState('');
    const [error, setError] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [dateToDelete, setDateToDelete] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [isEditing, setIsEditing] = useState({});
    const navigate = useNavigate();

    const fetchStudentData = async () => {
        const sub_group = 'none';
        try {
            const response = await axios.get(`http://0.0.0.0:8000/attendance_classes/${tssId}/${sub_group}`);
            console.log(response.data);
            setStudents(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [tssId]);

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

    const handleMarkChange = (index, classIndex, value) => {
        const updatedStudents = [...students];
        updatedStudents[index].mark_list[classIndex] = value;
        setStudents(updatedStudents);
    };

    const handleEditChange = (date, index, value) => {
        setEditValues(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [index]: value
            }
        }));
    };

    const handleEditToggle = (date) => {
        if (isEditing[date]) {
            handleSaveChanges(date);
        }
        setIsEditing(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const handleSaveChanges = async (date) => {
        const updatedMarks = editValues[date];
        const attendanceIds = [];
        const newMarkAttendanceList = [];

        const dateIndex = students[0].class_date_list.indexOf(date);

        students.forEach((student, index) => {
            const newValue = updatedMarks[index] !== undefined ? updatedMarks[index] : student.mark_list[dateIndex];

            if (newValue === null) {
                newMarkAttendanceList[index] = student.is_attended_list[dateIndex];
            } else {
                newMarkAttendanceList[index] = newValue;
            }

            attendanceIds[index] = student.attendance_id_list[dateIndex];
        });

        const patchData = {
            attendance_id_list: attendanceIds,
            new_mark_attendance_list: newMarkAttendanceList
        };

        console.log('Собранные значения для отправки:', patchData);

        try {
            const response = await axios.patch('http://0.0.0.0:8000/attendance_classes/', patchData);
            console.log('Ответ от сервера:', response.data);
            
            await fetchStudentData();

            setEditValues(prev => ({ ...prev, [date]: {} }));
            setIsEditing(prev => ({ ...prev, [date]: false }));
        } catch (error) {
            console.error('Ошибка при обновлении оценок:', error);
        }
    };

    const handleAddDate = async () => {
        const new_data = {
            tss_id: tssId,
            class_date: classDate,
            students_id: students.map(student => student.stud_id)
        };

        try {
            console.log(new_data);
            await axios.post('http://0.0.0.0:8000/attendance_classes', new_data);
            setIsModalVisible(false);
            setClassDate('');
            setError('');
            await fetchStudentData();
        } catch (err) {
            setError('Ошибка при добавлении даты. Пожалуйста, попробуйте еще раз.');
        }
    };

    const handleDeleteDate = async () => {
        if (dateToDelete) {
            const deleteData = {
                tss_id: tssId,
                class_date: dateToDelete
            };

            try {
                await axios.delete('http://0.0.0.0:8000/attendance_classes', { data: deleteData });
                setIsDeleteModalVisible(false);
                setDateToDelete(null);
                await fetchStudentData();
            } catch (error) {
                console.error('Ошибка при удалении даты:', error);
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Журнал успеваемости студентов</h1>
            <h2>Данные предмета</h2>
            <p>ID записи: {tssId}</p>
            <p>Название предмета: {sub_name}</p>
            <p>Тип класса: {class_type}</p>
            <p>Номер: {number}</p>
            <p>Курс: {curse}</p>
            <p>Специальность: {speciality}</p>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Добавить дату пары
            </Button>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>ФИО</th>
                                <th className="compact-column">Балл</th>
                                {students.length > 0 && students[0].class_date_list.map((date, index) => {
                                    const formattedDate = new Date(date);
                                    const year = formattedDate.getFullYear();
                                    const monthAndDay = formattedDate.toLocaleDateString('ru-RU', { month: '2-digit', day: '2-digit' });
                                    return (
                                        <th key={index}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div>
                                                    <Button 
                                                        className='delete-date-button button-spacing'
                                                        type="danger" 
                                                        onClick={() => {
                                                            setDateToDelete(date);
                                                            setIsDeleteModalVisible(true);
                                                        }}
                                                    >
                                                        Удалить
                                                    </Button>
                                                    <Button 
                                                        className='button-spacing'
                                                        type="primary" 
                                                        onClick={() => handleEditToggle(date)}
                                                    >
                                                        {isEditing[date] ? 'Сохранить' : 'Изменить'}
                                                    </Button>
                                                </div>
                                                <div>
                                                    {year}<br />
                                                    {monthAndDay}
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{`${student.stud_surname} ${student.stud_name} ${student.stud_father_name}`}</td>
                                    <td className="compact-column">{student.total_avg_score}</td>
                                    {student.class_date_list.map((_, classIndex) => (
                                        <td key={classIndex} onClick={() => console.log(student.attendance_id_list[classIndex])}>
                                            {isEditing[student.class_date_list[classIndex]] ? (
                                                <select 
                                                    value={editValues[student.class_date_list[classIndex]]?.[index] ?? 
                                                          (student.mark_list[classIndex] ?? student.is_attended_list[classIndex] ?? '')}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        const parsedValue = isNaN(newValue) ? newValue : Number(newValue);
                                                        handleEditChange(student.class_date_list[classIndex], index, parsedValue);
                                                    }} 
                                                    onBlur={() => {
                                                        const currentKey = student.class_date_list[classIndex];
                                                        const currentValue = editValues[currentKey]?.[index];
                                                        
                                                        // Если значение пустое после редактирования - сохраняем как null
                                                        if (currentValue === '') {
                                                            handleEditChange(currentKey, index, null);
                                                        }
                                                    }}
                                                    style={{ width: '100%' }}
                                                >
                                                    <option value="">Выберите оценку</option>
                                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'П', 'У', 'Н', 'В'].map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                student.mark_list[classIndex] !== null && student.mark_list[classIndex] !== undefined ? (
                                                    student.mark_list[classIndex]
                                                ) : (
                                                    student.is_attended_list[classIndex] === 'П' ? '' : student.is_attended_list[classIndex]
                                                )
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                title="Добавить дату пары"
                visible={isModalVisible}
                onOk={handleAddDate}
                onCancel={() => setIsModalVisible(false)}
            >
                <Input
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    placeholder="Введите дату пары"
                />
                {error && <Alert message={error} type="error" showIcon />}
            </Modal>

            <Modal
                title="Подтверждение удаления"
                visible={isDeleteModalVisible}
                onOk={handleDeleteDate}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Вы уверены, что хотите удалить дату {dateToDelete}?</p>
            </Modal>
        </div>
    );
};

export default StudentReport;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Импортируем useParams

const SubjectDetail = () => {
    const { tssId } = useParams(); // Получаем tss_id из параметров маршрута
    const [subjectData, setSubjectData] = useState(null); // Состояние для хранения данных
    const [loading, setLoading] = useState(true); // Состояние для загрузки

    useEffect(() => {
        const fetchSubjectData = async () => {
            try {
                const response = await fetch('http://0.0.0.0:8000/teachers_subjects_semester/all');
                const data = await response.json();
                setSubjectData(data); // Сохраняем данные в состоянии
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            } finally {
                setLoading(false); // Устанавливаем состояние загрузки в false
            }
        };

        fetchSubjectData(); // Вызываем функцию для получения данных
    }, []); // Пустой массив зависимостей, чтобы вызвать только один раз при монтировании

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Детали предмета</h1>
            <p>ID записи: {tssId}</p>
            {loading ? (
                <p>Загрузка...</p> // Сообщение о загрузке
            ) : subjectData ? (
                <pre>{JSON.stringify(subjectData, null, 2)}</pre> // Выводим JSON-данные
            ) : (
                <p>Нет данных для отображения.</p>
            )}
        </div>
    );
};

export default SubjectDetail;

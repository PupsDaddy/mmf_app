import React, { useRef, useState } from 'react';
import { Button, Modal, Alert, Flex } from 'antd';
import './Button.css';
import './Modal.css';
import InsertFormTeacherSubSem from './InsertFormTeacherSubSem';
import axios from 'axios';

const InsertModalTeacherSubSem = ({ onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const showModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const handleOk = async () => {
    if (formRef.current) {
      try {
        setLoading(true);
        const formData = formRef.current.submitForm();
        setError(null);

        if (!formData.teacher_id) {
          setError('Выберите преподавателя из списка');
          return;
        }

        // Проверяем существование связи
        const checkResponse = await axios.get(
          `http://127.0.0.1:8000/teachers_subjects_semester/check_exists?teacher_id=${formData.teacher_id}&sub_semester_id=${formData.sub_sem_id}&class_type=${formData.class_type}&sub_group=${formData.sub_group}&group_id=${formData.group_id}`
        );

        if (checkResponse.data.exists) {
          setError('Такая запись уже существует');
          return;
        }

        // Создаем новую запись
        const new_obj = {
          teacher_id: formData.teacher_id,
          sub_semester_id: formData.sub_sem_id,
          group_id: formData.group_id,
          class_type: formData.class_type,
          sub_group: formData.sub_group
        };

        await axios.post('http://127.0.0.1:8000/teachers_subjects_semester/', new_obj);
        
        setIsModalOpen(false);
        onSuccess();
      } catch (error) {
        console.error('Error in handleOk:', error);
        if (error.response) {
          if (error.response.status === 404) {
            setError('Предмет-семестр или группа не найдены');
          } else if (error.response.status === 422) {
            setError('Некорректные данные: ' + (error.response.data.detail || 'Проверьте все поля'));
          } else {
            setError('Произошла ошибка при сохранении');
          }
        } else {
          setError('Не удалось подключиться к серверу');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="add-button">
        Добавить новую запись
      </Button>
      <Modal
        width={600}
        title="Новая запись"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        okButtonProps={{
          className: 'green-button',
          loading: loading,
        }}
        cancelButtonProps={{
          className: 'white-button',
          disabled: loading,
        }}
        okText="Создать"
        cancelText="Закрыть"
        closable={false}
        className="modal-custom"
      >
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <InsertFormTeacherSubSem ref={formRef} disabled={loading} />
      </Modal>
    </>
  );
};

export default InsertModalTeacherSubSem;
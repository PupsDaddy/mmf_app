import React, { useRef, useState } from 'react';
import { Button, Modal, Alert , Flex} from 'antd'; 
import './Modal.css';
import InsertFormSubSem from './InsertFormSubSem';
import axios from 'axios';

const InsertModalSubSem = ({ onSuccess }) => {
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

        const subResponse = await axios.get(
          `http://127.0.0.1:8000/subjects/sub_id?sub_name=${formData.sub_name}`
        );
        const sub_id = subResponse.data.sub_id;

        const planResponse = await axios.get(
          `http://127.0.0.1:8000/syllabuses/plan_id?speciality=${formData.speciality}&start_year=${formData.start_year}`
        );
        const plan_id = planResponse.data.plan_id;

        const new_obj = {
          sub_id: sub_id,
          plan_id: plan_id,
          semester: formData.semester,
          lecture_per_week: formData.lecture_per_week,
          practice_per_week: formData.practice_per_week,
          has_exam: formData.has_exam, 
          has_zachet: formData.has_zachet,
          has_sub_group: formData.has_sub_group
        };

        await axios.post('http://127.0.0.1:8000/subjects_semester/', new_obj);
        
        setIsModalOpen(false);
        onSuccess();
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError('Предмет или учебный план не найдены');
          } else if (error.response.status === 422) {
            setError('Некорректные данные');
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
        <InsertFormSubSem ref={formRef} disabled={loading} />
      </Modal>
    </>
  );
};

export default InsertModalSubSem;
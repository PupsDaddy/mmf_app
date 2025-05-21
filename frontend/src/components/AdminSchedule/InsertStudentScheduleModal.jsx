import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Select, Alert } from 'antd';
import axios from 'axios';

const InsertStudentScheduleModal = ({ visible, onClose, onAdd, curse, group_number, n_class, group_id }) => {
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://0.0.0.0:8000/teachers_subjects_semester/${curse}/${group_number}`);
        console.log('Fetched subjects:', response.data);
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (visible) {
      fetchSubjects();
    }
  }, [visible, curse, group_number]);

  const handleOk = () => {
    form.validateFields()
      .then(async values => {
        const payload = {
          tss_id: parseInt(values.tss_id),
          group_id: group_id,
          sub_group: selectedSubGroup,
          curse: parseInt(curse),
          n_week: values.week === 'both' ? [1, 2] : [parseInt(values.week)],
          n_class: n_class,
          week_day: 1,
          class_room: parseInt(values.class_room),
        };
        console.log('POST request body:', payload);

        try {
          // Отправляем POST-запрос
          await axios.post('http://127.0.0.1:8000/schedule', payload);
          onAdd(payload);
          form.resetFields();
          onClose();
          setError(null);
        } catch (error) {
          console.error('Error in POST request:', error);
          setError(error.response?.data?.detail || 'Произошла ошибка при добавлении');
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleSubjectChange = (value) => {
    const selectedSubject = subjects.find(subject => subject.tss_id === value);
    if (selectedSubject) {
      setSelectedSubGroup(selectedSubject.sub_group);
    }
  };

  return (
    <Modal
      title="Добавить в расписание"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical">
        <Form.Item
          name="tss_id"
          label="Выберите предмет"
          rules={[{ required: true, message: 'Пожалуйста, выберите предмет!' }]}
        >
          <Select placeholder="Выберите предмет" onChange={handleSubjectChange}>
            {subjects.map(subject => (
              <Select.Option key={subject.tss_id} value={subject.tss_id}>
                {`${subject.teacher_surname || 'Неизвестно'} ${subject.teacher_name || ''} ${subject.teacher_father_name || ''} | ${subject.sub_name || 'Неизвестно'} | ${subject.class_type || 'Неизвестно'} | ${subject.sub_group || 'Неизвестно'}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="class_room"
          label="Аудитория"
          rules={[{ required: true, message: 'Пожалуйста, введите аудиторию!' }]}
        >
          <Input placeholder="Введите аудиторию" />
        </Form.Item>
        <Form.Item
          name="week"
          label="Неделя"
          rules={[{ required: true, message: 'Пожалуйста, выберите неделю!' }]}
        >
          <Select placeholder="Выберите неделю">
            <Select.Option value="1">1 неделя</Select.Option>
            <Select.Option value="2">2 неделя</Select.Option>
            <Select.Option value="both">Обе недели</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InsertStudentScheduleModal;

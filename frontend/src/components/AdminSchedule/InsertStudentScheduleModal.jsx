import React, { useRef, useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';

const InsertStudentScheduleModal = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onAdd(values); // Передаем данные в родительский компонент
        form.resetFields(); // Очищаем форму
        onClose(); // Закрываем модал
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Добавить в расписание"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="subject"
          label="Предмет"
          rules={[{ required: true, message: 'Пожалуйста, введите название предмета!' }]}
        >
          <Input placeholder="Введите название предмета" />
        </Form.Item>
        <Form.Item
          name="teacher"
          label="Преподаватель"
          rules={[{ required: true, message: 'Пожалуйста, выберите преподавателя!' }]}
        >
          <Select placeholder="Выберите преподавателя">
            <Select.Option value="1">Иванов И.И.</Select.Option>
            <Select.Option value="2">Петров П.П.</Select.Option>
            <Select.Option value="3">Сидоров С.С.</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="time"
          label="Время"
          rules={[{ required: true, message: 'Пожалуйста, введите время!' }]}
        >
          <Input placeholder="Введите время" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InsertStudentScheduleModal;

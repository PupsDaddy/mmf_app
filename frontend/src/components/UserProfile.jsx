import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getCurrentUser, authAxios } from '../utils/auth';
import LogoutButton from './LogoutButton';

const UserProfile = () => {
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();

  // Функция для отображения роли на русском языке
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'teacher':
        return 'Преподаватель';
      case 'stud':
        return 'Студент';
      default:
        return role;
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      await authAxios.post('/users/change-password', {
        login: values.login,
        old_password: values.oldPassword,
        new_password: values.newPassword
      });
      
      message.success('Пароль успешно изменен');
      setChangePasswordVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card 
        title="Профиль пользователя" 
        extra={<LogoutButton />}
        style={{ width: 300, margin: '20px auto' }}
      >
        <p><strong>ID:</strong> {currentUser?.id}</p>
        <p><strong>Роль:</strong> {getRoleDisplay(currentUser?.role)}</p>
        <Button 
          type="primary" 
          onClick={() => setChangePasswordVisible(true)}
          style={{ marginTop: 16 }}
        >
          Изменить пароль
        </Button>
      </Card>

      <Modal
        title="Изменение пароля"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleChangePassword}
          layout="vertical"
        >
          <Form.Item
            name="login"
            label="Логин"
            rules={[{ required: true, message: 'Пожалуйста, введите логин' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="oldPassword"
            label="Текущий пароль"
            rules={[{ required: true, message: 'Пожалуйста, введите текущий пароль' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[{ required: true, message: 'Пожалуйста, введите новый пароль' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Подтвердите пароль"
            rules={[{ required: true, message: 'Пожалуйста, подтвердите пароль' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Изменить пароль
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile; 
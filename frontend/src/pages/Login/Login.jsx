import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { isTokenExpired, refreshAccessToken } from '../../utils/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login', values);
      const { access_token, refresh_token, k } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Декодируем токен для получения роли
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const role = payload.role;
      const user_id = payload.user_id;

      // Перенаправление на основе роли
      if (role === 'admin') {
        console.log(payload)
        navigate(`/admin/${user_id}`);
      } else if (role === 'teacher') {
        navigate(`/teachers/${user_id}`);
      } else {
        message.warning('У вас нет доступа к этой странице.');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка входа. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="Вход в систему" className="login-card">
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="login"
            rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
          >
            <Input placeholder="Логин" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>

          {error && (
            <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 
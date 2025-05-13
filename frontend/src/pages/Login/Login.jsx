import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // Здесь будет логика авторизации
    console.log('Login values:', values);
    navigate('/admin');
  };

  return (
    <div className="login-container">
      <Card title="Вход в систему" className="login-card">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 
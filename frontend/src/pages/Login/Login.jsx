import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import { isAuthenticated, authAxios } from '../../utils/auth';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await authAxios.get('/users/me');
          const { user_id, role } = response.data;
          
          if (role === 'admin') {
            navigate(`/admin/${user_id}`);
          } else if (role === 'teacher') {
            navigate(`/teachers/${user_id}`);
          } else if (role === 'stud') {
            navigate(`/students/${user_id}`);
          }
        } catch (error) {
          console.error('Ошибка при проверке авторизации:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.post('/users/login', values);
      const { access_token, refresh_token } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const userResponse = await authAxios.get('/users/me');
      const { user_id, role } = userResponse.data;

      message.success('Вход выполнен успешно!');

      if (role === 'admin') {
        navigate(`/admin/${user_id}`);
      } else if (role === 'teacher') {
        navigate(`/teachers/${user_id}`);
      } else if (role === 'stud') {
        navigate(`/students/${user_id}`);
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
      <div className="login-content">
        <div className="login-header">
          <Title level={1} className="app-title">MY_MMF</Title>
          <Title level={3} className="app-subtitle">Информационная система факультета</Title>
        </div>
        
        <Card className="login-card">
          <Title level={2} className="login-title">Вход в систему</Title>
          
          <Form
            name="login"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
            className="login-form"
          >
            <Form.Item
              name="login"
              rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Логин" 
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="site-form-item-icon" />} 
                placeholder="Пароль" 
                className="login-input"
              />
            </Form.Item>

            {error && (
              <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
            )}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="login-button"
              >
                Войти
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login; 
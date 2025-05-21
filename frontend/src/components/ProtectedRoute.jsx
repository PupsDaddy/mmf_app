import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, authAxios } from '../utils/auth';
import { message, Spin } from 'antd';

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        if (!isAuthenticated()) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        const response = await authAxios.get('/users/me');
        const { role } = response.data;
        setUserRole(role);

        if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          message.error('У вас нет доступа к этой странице');
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setIsAuthorized(false);
        message.error('Ошибка при проверке авторизации');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute; 
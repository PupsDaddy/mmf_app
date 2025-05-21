import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from '../utils/auth';

const LogoutButton = ({ style }) => {
  const handleLogout = () => {
    logout();
  };

  return (
    <Button 
      type="primary" 
      danger 
      icon={<LogoutOutlined />} 
      onClick={handleLogout}
      style={style}
    >
      Выйти
    </Button>
  );
};

export default LogoutButton; 
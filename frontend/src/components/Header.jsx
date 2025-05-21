import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AntHeader style={{ 
      padding: 0, 
      background: '#1a3a1a',
      borderBottom: '4px solid #52c41a',
      height: '100px',
      lineHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      width: 'calc(100% - 200px)',
      zIndex: 1
    }}>
      <div style={{ 
        color: '#52c41a', 
        fontSize: '32px',
        fontWeight: 'bold',
        letterSpacing: '1px'
      }}>
        MY_MMF
      </div>
      <Button 
        type="primary" 
        danger 
        onClick={handleLogout}
        icon={<LogoutOutlined />}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '40px',
          padding: '0 20px',
          fontSize: '16px',
          fontWeight: 500,
          marginLeft: '16px'
        }}
      >
        Выйти
      </Button>
    </AntHeader>
  );
};

export default Header; 
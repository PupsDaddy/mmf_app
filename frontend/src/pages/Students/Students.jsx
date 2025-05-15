import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, ConfigProvider } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Students = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1-1');
  
  // Кастомизация темы
  const theme = {
    components: {
      Menu: {
        itemBg: '#1a3a1a',
        itemColor: '#ffffff',
        itemHoverColor: '#52c41a',
        itemHoverBg: '#2d5a2d',
        itemSelectedBg: '#2d5a2d',
        itemSelectedColor: '#52c41a',
        subMenuItemBg: '#1a3a1a',
        activeBarWidth: 0,
        itemActiveBg: '#1a3a1a',
        itemSelectedBg: '#2d5a2d',
        iconSize: 20,
        itemMarginInline: 12,
        itemHeight: 48,
        fontSize: 16,
      },
    },
    token: {
      colorPrimary: '#52c41a',
    },
  };

  const onSelect = ({ key }) => {
    setSelectedKey(key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case '1-1':
        return <div>Личный кабинет студента</div>;
      case '1-2':
        return <div>Расписание</div>;
      case '1-3':
        return <div>Занятия студента</div>;
      default:
        return null;
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          width={200}
          style={{ 
            background: '#1a3a1a',
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            bottom: 0,
            overflow: 'auto'
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onSelect={onSelect}
            style={{
              background: '#1a3a1a',
              borderRight: 0,
              paddingTop: '16px',
              fontSize: '18px'
            }}
            forceSubMenuRender={true}
            items={[
              {
                key: '1-1',
                icon: <UserOutlined style={{ fontSize: '24px' }} />,
                label: <Link to="">Личный кабинет</Link>,
              },
              {
                key: '1-2',
                icon: <CalendarOutlined style={{ fontSize: '24px' }} />,
                label: <Link to="">Расписание</Link>,
              },
              {
                key: '1-3',
                icon: <BookOutlined style={{ fontSize: '24px' }} />,
                label: <Link to="">Занятия</Link>,
              },
            ]}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header style={{ 
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
            width: `calc(100% - ${collapsed ? 80 : 200}px)`,
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
              type="text"
              icon={collapsed ? 
                <MenuUnfoldOutlined style={{ fontSize: '24px' }} /> : 
                <MenuFoldOutlined style={{ fontSize: '24px' }} />
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 80,
                height: 80,
                color: '#52c41a'
              }}
            />
          </Header>
          <Content
            style={{
              margin: '124px 16px 24px',
              padding: 24,
              minHeight: 'calc(100vh - 100px - 48px)',
              background: '#f0f9f0',
              overflow: 'auto'
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default  Students;
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, ConfigProvider } from 'antd';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

const { Sider, Content } = Layout;

// Компоненты для разных разделов
const StudentProfile = () => <div>Личный кабинет студента</div>;
const StudentScheduleComponent = () => <div>Расписание студента</div>;
const StudentClassesComponent = () => <div>Занятия студента</div>;

const Students = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1-1');
  const { id } = useParams();
  
  const onSelect = ({ key }) => {
    setSelectedKey(key);
  };

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

  const renderContent = () => {
    switch (selectedKey) {
      case '1-1':
        return <StudentProfile />;
      case '1-2':
        return <StudentScheduleComponent />;
      case '1-3':
        return <StudentClassesComponent />;
      default:
        return <StudentProfile />;
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
                label: 'Личный кабинет'
              },
              {
                key: '1-2',
                icon: <CalendarOutlined style={{ fontSize: '24px' }} />,
                label: 'Расписание'
              },
              {
                key: '1-3',
                icon: <BookOutlined style={{ fontSize: '24px' }} />,
                label: 'Занятия'
              },
            ]}
          />
          <Button
            type="text"
            icon={collapsed ? 
              <MenuUnfoldOutlined style={{ fontSize: '24px', color: '#52c41a' }} /> : 
              <MenuFoldOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%',
              height: 48,
              color: '#52c41a',
              marginTop: 16
            }}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          <Header />
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

export default Students;
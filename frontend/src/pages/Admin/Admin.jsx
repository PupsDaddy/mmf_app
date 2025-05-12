import AdminSubSemester from "../Admin/AdminSubSemester";
import AdminTeacherSubSemester from "../Admin/AdminTeacherSubSemester";
import StudentSchedule from "../../components/AdminSchedule/StudentSchedule";
import TeacherSchedule from "../../components/AdminSchedule/TeacherSchedule";
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined as TeamIcon
} from '@ant-design/icons';
import { Button, Layout, Menu, ConfigProvider } from 'antd';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(['1', '1-1']);
  
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
        // Увеличиваем размер иконок
        iconSize: 20,
        itemMarginInline: 12,
        // Увеличиваем размер текста
        itemHeight: 48,
        fontSize: 16,
      },
    },
    token: {
      colorPrimary: '#52c41a',
    },
  };

  const onSelect = ({ keyPath }) => {
    setSelectedKey(keyPath.reverse());
  };

  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          width={180}
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
            mode="inline"
            defaultSelectedKeys={selectedKey}
            selectedKeys={selectedKey}
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
                icon: <BookOutlined style={{ fontSize: '24px' }} />,
                label: 'Предмет-семестр',
              },
              {
                key: '1-2',
                icon: <TeamOutlined style={{ fontSize: '24px' }} />,
                label: 'Преподаватель-предмет-семестр',
              },
              {
                key: '1-3',
                icon: <CalendarOutlined style={{ fontSize: '24px' }} />,
                label: 'Расписание',
                children: [
                  {
                    key: '1-3-1',
                    icon: <TeamIcon style={{ fontSize: '24px' }} />,
                    label: 'Расписание студентов',
                  },
                  {
                    key: '1-3-2',
                    icon: <UserOutlined style={{ fontSize: '24px' }} />,
                    label: 'Расписание преподавателей',
                  }
                ]
              }
            ]}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 180 }}>
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
            width: `calc(100% - ${collapsed ? 80 : 180}px)`,
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
            {selectedKey.includes('1-1') && <AdminSubSemester userType="teachers" />}
            {selectedKey.includes('1-2') && <AdminTeacherSubSemester userType="students" />}
            {selectedKey.includes('1-3-1') && <StudentSchedule />}
            {selectedKey.includes('1-3-2') && <TeacherSchedule />}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
import React, { useEffect } from 'react';
import { App } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteConfirmModal = ({ pair, onConfirm }) => {
  const { modal } = App.useApp();

  useEffect(() => {
    console.log('Pair object in modal:', pair);

    modal.confirm({
      title: 'Вы уверены, что хотите удалить эту пару?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>{`${pair.sub_name} | ${pair.class_type}${pair.sub_group ? ` | ${pair.sub_group}` : ''}`}</p>
          <p style={{ color: '#1890ff', marginTop: '8px' }}>
            ID записи: {pair.schedule_id || 'ID не найден'}
          </p>
        </div>
      ),
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: onConfirm,
    });
  }, [pair, onConfirm, modal]);

  return null; // Этот компонент не рендерит ничего видимого
};

export default DeleteConfirmModal; 
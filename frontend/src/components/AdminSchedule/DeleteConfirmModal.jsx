import React, { useEffect, useState } from 'react';
import { App, Modal, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteConfirmModal = ({ pairs = [], onConfirm, onCancel }) => {
  const { modal } = App.useApp();
  const [selectedPair, setSelectedPair] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (pairs.length > 0 && !isModalOpen) {
      setIsModalOpen(true);
      const content = (
        <div>
          <Select
            placeholder="Выберите пару для удаления"
            style={{ width: '100%' }}
            onChange={(value) => {
              setSelectedPair(value);
              console.log('Выбранный schedule_id:', value);
            }}
          >
            {pairs.map(pair => (
              <Select.Option key={pair.schedule_id} value={pair.schedule_id}>
                {`${pair.sub_name} | ${pair.class_type} | ${pair.sub_group}`}
              </Select.Option>
            ))}
          </Select>
        </div>
      );

      modal.confirm({
        title: 'Выберите пару для удаления',
        icon: <ExclamationCircleOutlined />,
        content: content,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk: () => {
          if (selectedPair) {
            onConfirm(selectedPair);
            setSelectedPair(null);
          }
          setIsModalOpen(false);
        },
        onCancel: () => {
          onCancel();
          setSelectedPair(null);
          setIsModalOpen(false);
        },
      });
    }
  }, [pairs, modal, onConfirm, onCancel, isModalOpen]);

  return null;
};

export default DeleteConfirmModal; 
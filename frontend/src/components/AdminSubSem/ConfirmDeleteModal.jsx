import React from 'react';
import { Modal, Alert } from 'antd';

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel, errorMessage }) => {
  return (
    <Modal
      title="Подтверждение удаления"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Удалить"
      cancelText="Отмена"
    >
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <p>Вы уверены, что хотите удалить эту запись? Это действие нельзя будет отменить.</p>
    </Modal>
  );
};

export default ConfirmDeleteModal;

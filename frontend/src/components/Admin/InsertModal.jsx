import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import "../Admin/Button.css"
import InsertForm from "../Admin/InsertForm.jsx"


const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

const InsertModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal} className='green-button'>
        Добавить новую запись
      </Button>
      <Modal width={600} title="Новая запись" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      maskClosable={false}
      okButtonProps = {{
        className:'green-button'
      }}
      cancelButtonProps={{
        className: 'white-button'
      }}
      okText='Создать'
      cancelText="Закрыть"
      closable={false}>
        <InsertForm></InsertForm>
      </Modal>
    </>
  );
};
export default InsertModal;




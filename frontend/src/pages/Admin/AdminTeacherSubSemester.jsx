import { useState } from 'react';
import { Flex } from 'antd';
import TeacherSubSemTable from "../../components/AdminTeacherSubSem/TeacherSubSemTable";
import InsertModalTeacherSubSem from "../../components/AdminTeacherSubSem/InsertModalTeacherSubSem";

const AdminTeacherSubSemester = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleInsertSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="admin-container" style={{ 
      padding: '24px', 
      maxWidth: '1600px', 
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Flex justify="flex-end" style={{ marginBottom: 20, width: '100%' }}>
        <InsertModalTeacherSubSem onSuccess={handleInsertSuccess} />
      </Flex>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <TeacherSubSemTable refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default AdminTeacherSubSemester;
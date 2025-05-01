import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
import axios from 'axios';
import '../Admin/Table.css'

const columns = [
  {
    title: 'Предмет',
    dataIndex: 'sub_name',
    key: 'sub_name',
    align: 'center',
    render:(text) => <p  style={{ fontSize: 20, fontWeight: 500 }}>{text}</p>,
    
  },
  {
    title: '№ семестра',
    dataIndex: 'semester',
    key: 'semester',
    align: 'center'
  },
  {
    title: 'Специальность',
    dataIndex: 'speciality',
    key: 'speciality',
    align: 'center'
  },
  {
    title: 'Экзамен',
    dataIndex: 'has_exam',
    key: 'has_exam',
    render: (_, {has_exam}) => { let answer = has_exam === true ? 'Да' : 'Нет';
    return <p>{answer}</p>;
     },
     align: 'center'
  },
  {
    title: 'Зачет',
    dataIndex: 'has_zachet',
    key: 'has_zachet',
    render: (_, {has_zachet}) => { let answer = has_zachet === true ? 'Да' : 'Нет';
    return <p>{answer}</p>;
     },
     align: 'center'
  },
  {
    title: 'Подгруппы',
    dataIndex: 'has_sub_group',
    key: 'has_sub_group',
    render: (_, {has_sub_group}) => { let answer = has_sub_group === true ? 'Да' : 'Нет';
    return <p>{answer}</p>;
     },
     align: 'center'
  },
  {
    title: 'Лекции',
    dataIndex: 'lecture_per_week',
    key: 'lecture_per_week',
    align: 'center'
  },
  {
    title: 'Практики',
    dataIndex: 'practice_per_week',
    key: 'practice_per_week',
    align: 'center'
  
  },
  {
    title: 'Год уч. плана',
    dataIndex: 'start_year',
    key: 'start_year',
    align: 'center'
  }
];


const SubSemTable = () => {
  const [subjects_semester, SetSubjects_semester] = useState([]);

  const fetchSubjectsSemester = () =>
  {
    axios.get('http://127.0.0.1:8000/subjects_semester/full_info').then(r => {
    const SubjectsSemesterResponce = r.data.map(el => {
      el.key = el.id;
      delete el.id;
      return el
    });
    SetSubjects_semester(SubjectsSemesterResponce);
  }
  )
  }
  useEffect(() => {
    fetchSubjectsSemester()
  }, []);

  return (
    <Table 
    rowClassName={() => "hover-row"}
      columns={columns} 
      className="custom-table"
      dataSource={subjects_semester} 
      bordered = {true}
      pagination={{
        hideOnSinglePage: true,
        pageSize: 3,
        align: "start",
        position: ['bottomCenter'],
        defaultCurrent: 1
      }}
    />
  );
};

export default SubSemTable;
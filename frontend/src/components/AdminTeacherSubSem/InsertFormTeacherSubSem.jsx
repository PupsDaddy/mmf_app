import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { AutoComplete, Flex, Select, Input } from 'antd';
import axios from 'axios';
import './InsertFormTeacherSubSem.css';

const InsertFormTeacherSubSem = forwardRef((props, ref) => {
  const [full_name, setFullName] = useState('');
  const [teacher_id, setTeacherId] = useState(null);
  const [sub_sem_id, setSubSemId] = useState(null);
  const [sub_sem_text, setSubSemText] = useState('');
  const [class_type, setClassType] = useState('L');
  const [sub_group, setSubGroup] = useState('');
  const [group_id, setGroupId] = useState(null);
  
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [subSemOptions, setSubSemOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  const fetchTeachers = (searchText) => {
    if (searchText.trim() === '') {
      setTeacherOptions([]);
    } else {
      const cleanSearchText = searchText.trim().toLowerCase();
      console.log('Searching for teachers with text:', cleanSearchText);
      axios.get(`http://127.0.0.1:8000/teachers/first_letters/?full_name=${cleanSearchText}`).then((r) => {
        console.log('API response:', r.data);
        const data = r.data.map((item) => ({
          value: `${item.teacher_surname} ${item.teacher_name?.[0]}.${item.teacher_father_name?.[0]}.`,
          label: `${item.teacher_surname} ${item.teacher_name?.[0]}.${item.teacher_father_name?.[0]}.`,
          id: item.id
        }));
        console.log('Processed options:', data);
        setTeacherOptions(data);
      }).catch(error => {
        console.error('Error fetching teachers:', error);
      });
    }
  };

  const fetchSubSems = (searchText) => {
    if (searchText.trim() === '') {
      setSubSemOptions([]);
    } else {
      const cleanSearchText = searchText.trim().toLowerCase();
      console.log('Searching for subjects with text:', cleanSearchText);
      axios.get(`http://127.0.0.1:8000/subjects_semester/first_letters?sub_name=${cleanSearchText}`).then((r) => {
        console.log('API response:', r.data);
        const data = r.data.map((item) => ({
          value: `${item.subject.sub_name} (Семестр ${item.semester}) - ${item.syllabus.speciality} ${item.syllabus.start_year}`,
          label: `${item.subject.sub_name} (Семестр ${item.semester}) - ${item.syllabus.speciality} ${item.syllabus.start_year}`,
          id: item.id
        }));
        console.log('Processed options:', data);
        setSubSemOptions(data);
      }).catch(error => {
        console.error('Error fetching subjects:', error);
        setSubSemOptions([]);
      });
    }
  };

  const fetchGroups = () => {
    axios.get('http://127.0.0.1:8000/groups/all').then((r) => {
      const data = r.data.map((item) => ({
        value: item.id,
        label: (
          <div className="group-option">
            <span className="group-course">Курс: <span className="group-course-value">{item.curse}</span></span>
            <span className="group-number">Группа: <span className="group-number-value">{item.number}</span></span>
            <span className="group-speciality">(<span className="group-speciality-value">{item.speciality}</span>)</span>
          </div>
        ),
        id: item.id
      }));
      setGroupOptions(data);
    });
  };

  // Функция, которая возвращает данные формы
  const submitForm = () => {
    const formData = {
      teacher_id,
      full_name,
      sub_sem_id,
      class_type,
      sub_group: sub_group || null,
      group_id
    };
    console.log('Submitting form data:', formData);
    return formData;
  };

  // Выставляем submitForm наружу через ref
  useImperativeHandle(ref, () => ({
    submitForm,
  }));

  return (
    <>
      <Flex gap={'large'} justify={'space-between'}>
        <Flex gap={1} vertical={true}>
          <p>Преподаватель</p>
          {!teacher_id ? (
            <AutoComplete
              allowClear={true}
              options={teacherOptions}
              style={{ width: 245 }}
              onSearch={text => {
                console.log('AutoComplete search triggered with:', text);
                fetchTeachers(text);
              }}
              onChange={(value, option) => {
                console.log('AutoComplete value changed to:', value, 'option:', option);
                setFullName(value);
                setTeacherId(option?.id || null);
              }}
              placeholder="Введите ФИО преподавателя"
              value={full_name}
            />
          ) : (
            <Select
              style={{ width: 245 }}
              value={full_name}
              options={[{ value: full_name, label: full_name }]}
              onChange={() => {
                setFullName('');
                setTeacherId(null);
              }}
              allowClear={true}
            />
          )}
        </Flex>
        <Flex gap={1} vertical={true}>
          <p>Предмет-Семестр</p>
          {!sub_sem_id ? (
            <AutoComplete
              allowClear={true}
              options={subSemOptions}
              style={{ width: 245 }}
              onSearch={text => {
                console.log('SubSem search triggered with:', text);
                setSubSemText(text);
                fetchSubSems(text);
              }}
              onChange={(value, option) => {
                console.log('SubSem value changed to:', value, 'option:', option);
                setSubSemText(value);
                setSubSemId(option?.id || null);
              }}
              placeholder="Введите название предмета"
              value={sub_sem_text}
              notFoundContent={null}
            />
          ) : (
            <Select
              style={{ width: 245 }}
              value={sub_sem_text}
              options={[{ value: sub_sem_text, label: sub_sem_text }]}
              onChange={() => {
                setSubSemText('');
                setSubSemId(null);
              }}
              allowClear={true}
            />
          )}
        </Flex>
      </Flex>
      <Flex gap={'large'} justify={'space-between'}>
        <Flex gap={1} vertical={true}>
          <p>Группа</p>
          <Select
            style={{ width: 245 }}
            options={groupOptions}
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchGroups();
              }
            }}
            onChange={(value, option) => {
              console.log('Group value changed to:', value);
              setGroupId(value);
            }}
            placeholder="Выберите группу"
            value={group_id}
            optionLabelProp="label"
          />
        </Flex>
        <Flex gap={1} vertical={true}>
          <p>Тип занятия</p>
          <Select
            style={{ width: 245 }}
            options={[
              { label: 'Лекция', value: 'L' },
              { label: 'Практика', value: 'P' }
            ]}
            onChange={value => {
              console.log('Class type changed to:', value);
              setClassType(value);
              if (value === 'L') {
                setSubGroup('');
              }
            }}
            value={class_type}
          />
        </Flex>
      </Flex>
      <Flex gap={'large'} justify={'space-between'}>
        <Flex gap={1} vertical={true}>
          <p>Подгруппа</p>
          <Select
            style={{ width: 245 }}
            options={[
              { label: 'Нет', value: '' },
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
              { label: 'c', value: 'c' }
            ]}
            onChange={value => {
              console.log('Sub group changed to:', value);
              setSubGroup(value);
            }}
            value={sub_group}
            placeholder="Выберите подгруппу"
            disabled={class_type === 'L'}
          />
        </Flex>
      </Flex>
    </>
  );
});

export default InsertFormTeacherSubSem;
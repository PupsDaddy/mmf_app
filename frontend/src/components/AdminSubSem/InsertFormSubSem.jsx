import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { AutoComplete, Flex, Select, InputNumber } from 'antd';
import axios from 'axios';

const InsertFormSubSem = forwardRef((props, ref) => {
  const [sub_name, setSubject] = useState('');
  const [semester, setSemester] = useState(null);
  const [speciality, setSpeciality] = useState(null);
  const [start_year, setYear] = useState(null);
  const [lecture_per_week, setLectures] = useState(0);
  const [practice_per_week, setPractices] = useState(0);
  const [has_exam, setHasExam] = useState(true);
  const [has_zachet, setHasZachet] = useState(true);
  const [has_sub_group, setHasSubgroups] = useState(true);
  const [options, setOptions] = useState([]);

  const fetchSubjects = (searchText) => {
    if (searchText.trim() === '') {
      setOptions([]);
    } else {
      axios.get(`http://127.0.0.1:8000/subjects/first_letters/?sub_name=${searchText}`).then((r) => {
        const data = r.data.map((item) => ({ value: item.sub_name }));
        setOptions(data);
      });
    }
  };

  // Функция, которая возвращает данные формы
  const submitForm = () => {
    return {
      sub_name,
      semester,
      speciality,
      start_year,
      lecture_per_week,
      practice_per_week,
      has_exam,
      has_zachet,
      has_sub_group,
    };
  };

  // Выставляем submitForm наружу через ref
  useImperativeHandle(ref, () => ({
    submitForm,
  }));



  return (
    <>
      <Flex gap={'large'} justify={'space-between'}>
        <Flex gap={1} vertical={true}>
          <p>Предмет</p>
          <AutoComplete
            allowClear={true}
            variant='outlined'
            options={options}
            style={{ width: 245 }}
            onSearch={text => fetchSubjects(text)}
            onChange={value => setSubject(value)}
            placeholder="Введите предмет"
            value={sub_name} 
          />
        </Flex>
        <Flex gap={1} vertical={true}>
          <p>№ семестра</p>
          <InputNumber
            min={1}
            max={7}
            variant='outlined'
            style={{ width: 245 }}
            placeholder="Введите № семестра"
            onChange={value => setSemester(value)} 
            value={semester} 
          />
        </Flex>
      </Flex>
      <Flex gap={'large'} justify={'space-between'}>
        <Flex gap={1} vertical={true}>
          <p>Специальность</p>
          <Select 
            style={{ width: 245 }} 
            defaultValue={null} 
            options={[
              {label:'КоэМы', value:'km'}, 
              {label:'Педы', value:'ped'}, 
              {label:'Вебы', value:'web'}, 
              {label:'Мобилки', value:'mob'}, 
              {label:'Механики', value:'mech'}, 
              {label:'Китайские Механики', value:'km_mech'}
            ]}
            onChange={value => setSpeciality(value)} 
            value={speciality}
          />
        </Flex>
        <Flex gap={1} vertical={true}>
          <p>Год учебного плана</p>
          <InputNumber
            max={2025}
            min={2019}
            variant='outlined'
            style={{ width: 245 }}
            placeholder="Введите год учебного плана"
            onChange={value => setYear(value)}
            value={start_year}
          />
        </Flex>
      </Flex>
      <Flex gap={'large'} justify={'space-between'}>
        <Flex gap={1} vertical={true}>
          <p>Лекции(за одну неделю)</p>
          <Select 
            style={{ width: 245 }} 
            defaultValue={0} 
            options={[
              {label:'0', value:0}, 
              {label:'0.5', value:0.5}, 
              {label:'1', value:1}, 
              {label:'2', value:2}
            ]}
            onChange={value => setLectures(value)} 
            value={lecture_per_week} 
          />
        </Flex>
        <Flex style={{ width: 245 }} gap={1} vertical={true}>
          <p>Практики(за одну неделю)</p>
          <Select 
            defaultValue={0} 
            options={[
              {label:'0', value:0}, 
              {label:'0.5', value:0.5}, 
              {label:'1', value:1}, 
              {label:'2', value:2}
            ]}
            onChange={value => setPractices(value)} 
            value={practice_per_week}
          />
        </Flex>
      </Flex>
      <Flex gap={'large'} justify={'left'}>
        <Flex gap={1} vertical={true} align={'center'}>
          <p>Экзамен</p>
          <Select 
            defaultValue={true} 
            options={[
              {label:'Да', value:true},
              {label:'Нет', value:false}
            ]}
            onChange={value => setHasExam(value)}
            value={has_exam}
          />
        </Flex>
        <Flex gap={1} vertical={true} align={'center'}>
          <p>Зачет</p>
          <Select 
            defaultValue={true} 
            options={[
              {label:'Да', value:true},
              {label:'Нет', value:false}
            ]}
            onChange={value => setHasZachet(value)} 
            value={has_zachet}
          />
        </Flex>
        <Flex gap={1} vertical={true} align={'center'}>
          <p>Подгруппы</p>
          <Select 
            defaultValue={true} 
            options={[
              {label:'Да', value:true},
              {label:'Нет', value:false}
            ]}
            onChange={value => setHasSubgroups(value)} 
            value={has_sub_group} 
          />
        </Flex>
      </Flex>
    </>
  );
});

export default InsertFormSubSem;







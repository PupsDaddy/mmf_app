import React, { useState } from 'react';
import { AutoComplete, Flex, Select, Input, InputNumber } from 'antd';
import axios from 'axios';

const InsertForm = () => {
  const [options, setOptions] = useState([]);
  const fetchSubjects = searchText =>
{
    if (searchText.trim() === ''){
        setOptions([]);
    }
    else{
    axios.get(`http://127.0.0.1:8000/subjects/?sub_name=${searchText}`).then(r => {
        const data = r.data.map(item =>({value:item.sub_name}));
        console.log(data)
        setOptions(data);
    })
}
}
  return (
    <>
    <Flex gap={'large'} justify={'space-between'}>
    <Flex gap={1}  vertical={true}>
    <p>Предмет</p>
      <AutoComplete
      allowClear={true}
      variant='outlined'
        options={options}
        style={{ width: 245 }}
        onSearch={text => fetchSubjects(text)}
        placeholder="Введите предмет"
      />
      </Flex>
      <Flex gap={1}  vertical={true}>
      <p>№ семестра</p>
      <InputNumber
      allowClear={true}
       min={1}
       max={7}
      variant='outlined'
        style={{ width: 245 }}
        placeholder="Введите № семестра"
      />
       </Flex>
       </Flex>
       <Flex gap={'large'} justify={'space-between'}>
    <Flex gap={1}  vertical={true}>
    <p>Специальность</p>
    <Select style={{ width: 245 }} defaultValue={null} options={[{label:'КоэМы', value:'km'}, {label:'Педы', value:'ped'}, {label:'Вебы', value:'web'}, {label:'Мобилки', value:'mob'}, {label:'Механики', value:'mech'}, {label:'Китайские Механики', value:'km_mech'}]}></Select>

      </Flex>
      <Flex gap={1}  vertical={true}>
      <p>Год учебного плана</p>
      <InputNumber
      allowClear={true}
      max={2025}
      min={2019}
      variant='outlined'
        options={options}
        style={{ width: 245 }}
        placeholder="Введите год учебного плана"
      />
       </Flex>
       </Flex>
       <Flex gap={'large'} justify={'space-between'}>
    <Flex gap={1}  vertical={true}>
    <p>Лекции(за одну неделю)</p>
    <Select style={{ width: 245 }} defaultValue={0} options={[{label:'0', value:0}, {label:'0.5', value:0.5}, {label:'1', value:1}, {label:'2', value:2}]}></Select>
  
      </Flex>
      <Flex style={{ width: 245 }} gap={1}  vertical={true}>
      <p>Практики(за одну неделю)</p>
      <Select defaultValue={0} options={[{label:'0', value:0}, {label:'0.5', value:0.5}, {label:'1', value:1}, {label:'2', value:2}]}></Select>

       </Flex>
       </Flex>

       <Flex gap={'large'} justify={'left'}>
    <Flex gap={1}  vertical={true} align={'center'}>
    <p>Экзамен</p>
    <Select defaultValue={true} options={[{label:'Да', value:true},{label:'Нет', value:false}]}></Select>
      </Flex>
      <Flex gap={1}  vertical={true} align={'center'}>
      <p>Зачет</p>
    <Select defaultValue={true} options={[{label:'Да', value:true},{label:'Нет', value:false}]}></Select>
       </Flex>

    <Flex gap={1}  vertical={true} align={'center'}>
    <p>Подгруппы</p>
    <Select defaultValue={true} options={[{label:'Да', value:true},{label:'Нет', value:false}]}></Select>
      </Flex>
       </Flex>
    </>
  );
};
export default InsertForm;
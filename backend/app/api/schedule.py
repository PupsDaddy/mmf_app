from typing import List, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.app.dependencies.database import SessionDep

from backend.app.crud import get_schedule_filtered, delete_schedule_by_id, check_insert_in_schedule, insert_in_schedule
router = APIRouter(tags=['Расписание'], prefix='/schedule')





#получить все пары(название предмета, препод, ауда, время) группы конкретной недели
@router.get('/{group_id}/{n_week}')
def get_schedule_filter(session: SessionDep, group_id: int, n_week: int):
    return get_schedule_filtered(session, group_id, n_week)



@router.delete('/{id}')
def delete_by_id(id:int, session:SessionDep):
    return delete_schedule_by_id(session, id)


class NewInSchedule(BaseModel):
    tss_id: int
    group_id: int
    sub_group: Literal[None, 'a', 'b', 'c']
    curse: int
    n_week:List[int]
    n_class: int
    week_day: int
    class_room: int

@router.post('/')
def insert_new_class_in_schedule(session:SessionDep, new_obj:NewInSchedule):
    return insert_in_schedule(session, new_obj)



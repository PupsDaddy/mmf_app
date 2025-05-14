from fastapi import APIRouter, HTTPException



from backend.app.dependencies.database import SessionDep

from backend.app.crud import get_schedule_filtered, delete_schedule_by_id
router = APIRouter(tags=['Расписание'], prefix='/schedule')





#получить все пары(название предмета, препод, ауда, время) группы конкретной недели
@router.get('/{group_id}/{n_week}')
def get_schedule_filter(session: SessionDep, group_id: int, n_week: int):
    return get_schedule_filtered(session, group_id, n_week)



@router.delete('/{id}')
def delete_by_id(id:int, session:SessionDep):
    return delete_schedule_by_id(session, id)






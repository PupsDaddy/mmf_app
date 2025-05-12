from fastapi import APIRouter, HTTPException



from backend.app.dependencies.database import SessionDep
from backend.app.models.schedule import Schedule as ScheduleORM
from backend.app.models.teachers_subjects_semester import TeacherSubjectSemester as tssORM
from backend.app.models.teachers import Teacher as TeacherORM
from backend.app.models.subjects import Subject as SubjectORM
from backend.app.models.subjects_semester import SubjectSemester as ssORM


router = APIRouter(tags=['Расписание'], prefix='/schedule')





#получить все пары(название предмета, препод, ауда, время) группы конкретной недели
@router.get('/{group_id}/{n_week}')
def get_schedule(session: SessionDep, group_id: int, n_week: int):
    query = (
        session.query(
            ScheduleORM.id,
            SubjectORM.sub_name,
            TeacherORM.teacher_name,
            TeacherORM.teacher_father_name,
            TeacherORM.teacher_surname,
            tssORM.class_type,
            tssORM.sub_group,
            ScheduleORM.n_class,
            ScheduleORM.week_day,
            ScheduleORM.class_room,
            ScheduleORM.start_time,
            ScheduleORM.end_time
        )
        .select_from(tssORM)
        .join(TeacherORM)
        .join(ssORM)
        .join(SubjectORM)
        .outerjoin(ScheduleORM)
        .filter(
            tssORM.group_id == group_id,
            ScheduleORM.n_week == n_week
        )
    )

    res = [dict(zip(['schedule_id', 'sub_name', 'teacher_name', 'teacher_father_name', 'teacher_surname',
                     'class_type', 'sub_group' ,'n_class','week_day',
                    'class_room', 'start_time', 'end_time' ], i)) for i in query.all()]
    return res



@router.delete('/{id}')
def delete_by_id(id:int, session:SessionDep):
    schedule_obj = session.get(ScheduleORM, id)
    session.delete(schedule_obj)
    session.commit()
    return {'OK': 200}






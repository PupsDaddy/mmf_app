import datetime

from fastapi import HTTPException
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy import and_, select, desc
from backend.app.auth.utils import hash_password, validate_password
from backend.app.models.users import User as UserORM
from backend.app.models import Student as StudentORM
from backend.app.models.groups import Group as GroupORM
from backend.app.models.syllabuses import Syllabus as SyllabusORM
from sqlalchemy import func
from backend.app.models.attendance import Attendance as AttendanceORM
from backend.app.models.classes import Class as ClassORM
from backend.app.models.subjects import Subject as SubjectORM
from backend.app.models.teachers import Teacher as TeacherORM
from urllib.parse import unquote
from sqlalchemy.orm import joinedload
from backend.app.models.subjects_semester import SubjectSemester as SubjectSemesterORM
from backend.app.schemas.subjects import Subject
from backend.app.schemas.subjects_semester import SubjectSemesterCreate, SubjectSemester
from backend.app.schemas.syllabuses import Syllabus
from pydantic import BaseModel, conint
from typing import Union, Any, List, Literal
from backend.app.models.teachers_subjects_semester import TeacherSubjectSemester as tssORM
from backend.app.schemas.teachers_subjects_semester import TeacherSubjectSemesterCreate
from backend.app.models.schedule import Schedule as ScheduleORM
from backend.app.utils import get_start_time, get_end_time


class NewTeacherId(BaseModel):
    new_teacher_id: Union[None,int]

def get_new_id(session: Session, class_):
    new_id = session.execute(select(class_.id).order_by(desc(class_.id)).limit(1)).first()
    if not new_id:
        new_id = 1
    else:
        new_id = new_id[0] + 1
    return new_id


# Группы
def get_groups(session: Session):
    groups = session.query(GroupORM).all()
    return groups


def get_groups_in(session:Session, ids: str):
    ids = [int(i) for i in unquote(ids).split(',')]
    groups =  session.query(GroupORM).filter(GroupORM.id.in_(ids)).all()
    return groups

def get_one_group_by_id(session: Session, group_id: int):
    group = session.get(GroupORM, group_id)
    return group


def get_one_group_id(session:Session, curse:int, group_number: int):
    group = session.query(GroupORM.id).where(GroupORM.curse == curse).where(GroupORM.number == group_number).first()
    if group:
        return {'group_id': group[0]}
    else:
        return None

def get_group_id_from_tss_by_tss_id(session:Session, tss_id:int) -> int:
    tss_obj = session.get(tssORM, tss_id)
    if not tss_obj:
        raise HTTPException(status_code=404, detail='Нет записи в таким id')
    return tss_obj.group_id


# Учебные планы

def get_syllabuses(session:Session):
    syllabuses =  session.query(SyllabusORM).order_by(SyllabusORM.id).all()
    return syllabuses



def get_syllabuses_in(session:Session, ids: str):
    ids = [int(i) for i in unquote(ids).split(',')]
    syllabuses = session.query(SyllabusORM).filter(SyllabusORM.id.in_(ids)).all()
    return syllabuses

def get_one_syllabus_id_by_sub_name(session:Session, speciality:str, start_year: int):
    syllabus = session.query(SyllabusORM).where(and_(SyllabusORM.speciality == speciality, SyllabusORM.start_year == start_year)).first()
    if syllabus:
        return {'plan_id': syllabus.id}
    return None



# Предметы
def get_subjects(session:Session):
    subjects = session.query(SubjectORM).all()
    return  subjects


def get_subjects_in(session:Session, ids: str):
    ids = [int(i) for i in unquote(ids).split(',')]
    subjects = session.query(SubjectORM).filter(SubjectORM.id.in_(ids)).all()
    return subjects


def get_subjects_first_letters(session:Session, sub_name:str):
    decoded_sub_name = unquote(sub_name)
    subjects = session.query(SubjectORM).filter(func.lower(SubjectORM.sub_name).like(decoded_sub_name.lower() + '%'))
    return subjects


def get_one_sub_id_by_sub_name(session:Session, sub_name:str):
    decoded_sub_name = unquote(sub_name)
    subject = session.query(SubjectORM).where(SubjectORM.sub_name == decoded_sub_name).first()
    if subject:
        return {'sub_id':subject.id}
    return None

# Преподаватели

def get_teachers(session:Session):
    teachers = session.query(TeacherORM).order_by(TeacherORM.id).all()
    return teachers

def get_teacher_by_id(session:Session, teacher_id:int):
    teacher = session.get(TeacherORM, teacher_id)
    return teacher


def get_teachers_in(session:Session, ids: str):
    ids = [int(i) for i in unquote(ids).split(',')]
    teachers = session.query(TeacherORM).filter(TeacherORM.id.in_(ids)).all()
    return teachers



def get_filtered_teachers(session:Session, department: str, position:str):
    department = unquote(department)
    position = unquote(position)
    if  department != 'none' and position != 'none':
        res = session.query(TeacherORM).where(TeacherORM.department == department).where(TeacherORM.teacher_position == position)
    else:
        if  department != 'none':
            res = session.query(TeacherORM).where(TeacherORM.department == department)
        elif position != 'none':
            res = session.query(TeacherORM).where(TeacherORM.teacher_position == position)
        else:
            res = session.query(TeacherORM)

    teachers =  sorted(res.all(), key=lambda x: x.teacher_surname.lower())
    return teachers



def get_teachers_by_first_letters(session:Session, full_name):
    decoded_fullname = unquote(full_name)
    teachers_name_list =  session.execute(session.query(TeacherORM).filter(func.lower(TeacherORM.teacher_name).like(decoded_fullname.lower() + '%'))).scalars().all()
    teachers_surname_list = session.execute(session.query(TeacherORM).filter(func.lower(TeacherORM.teacher_surname).like(decoded_fullname.lower() + '%'))).scalars().all()
    teachers =  teachers_name_list + teachers_surname_list
    return teachers


# Предметы-Семестр

def get_subjects_semester(session:Session):
    subjects_semester =  session.query(SubjectSemesterORM).order_by(SubjectSemesterORM.id).all()
    return subjects_semester


def get_sub_sem_syllabuses_in(session:Session, ids: str):
    ids = [int(i) for i in unquote(ids).split(',')]
    subjects_semester = session.query(SubjectSemesterORM).filter(SubjectSemesterORM.id.in_(ids)).all()
    return subjects_semester

def insert_new_sub_semester(session:Session, sub_semester:SubjectSemesterCreate):
    find_duplicate = (session.query(SubjectSemesterORM).
                      where(and_(SubjectSemesterORM.semester == sub_semester.semester,
                SubjectSemesterORM.plan_id == sub_semester.plan_id,
                SubjectSemesterORM.sub_id == sub_semester.sub_id,
                SubjectSemesterORM.practice_per_week == sub_semester.practice_per_week,
                SubjectSemesterORM.lecture_per_week == sub_semester.lecture_per_week,
                SubjectSemesterORM.has_sub_group == sub_semester.has_sub_group,
                SubjectSemesterORM.has_exam == sub_semester.has_exam,
                SubjectSemesterORM.has_zachet == sub_semester.has_zachet)).all())
    if find_duplicate:
        raise status.HTTP_409_CONFLICT()
    params_dict = sub_semester.model_dump()
    new_id = get_new_id(session, SubjectSemesterORM)
    new_sub_semester = SubjectSemesterORM(id=new_id, **params_dict)
    session.add(new_sub_semester)
    session.commit()
    return {'status_code': 200, 'detail': 'created!'}




def get_subjects_sem_by_first_letters_sub(session:Session, sub_name:str):
    decoded_sub_name = unquote(sub_name).lower()
    ss_list = session.query(SubjectSemesterORM).options(joinedload(SubjectSemesterORM.sub), joinedload(SubjectSemesterORM.syllabus)).all()
    subjects_semester =  [SubjectSemester.model_validate(ss_obj).model_dump()
            | {'subject': Subject.model_validate(ss_obj.sub).model_dump()}
            | {'syllabus' : Syllabus.model_validate(ss_obj.syllabus).model_dump()}
            for ss_obj in ss_list if ss_obj.sub.sub_name.lower().startswith(decoded_sub_name)]
    return subjects_semester



def delete_sub_sem(session:Session, sub_sem_id: int):
    sub_sem = session.get(SubjectSemesterORM, sub_sem_id)
    if not sub_sem:
        raise HTTPException(status_code=404, detail='Нет записи с таким id')
    try:
        session.delete(sub_sem)
        session.commit()
        return {"detail": "SubSem deleted successfully"}
    except:
        raise HTTPException(status_code=409, detail='На эту запись ссылаются в других важных таблицах! '
                                                    'Удаление запрещено!')


# Преподаватели-Предметы-Семестр

def get_teachers_subs_semester(session: Session):
    tss = session.query(tssORM).order_by(tssORM.id).all()
    return tss



def update_teacher_id_in_TSS(session:Session,  tss_id:int, new_teacher_id: NewTeacherId):
    tss_obj = session.get(tssORM, tss_id)
    if not tss_obj:
        raise HTTPException(status_code=404, detail='Нет записи с таким id!')
    tss_obj.teacher_id = new_teacher_id.new_teacher_id
    session.commit()
    return {"OK": 200}




def insert_tss(session:Session, new_tss:TeacherSubjectSemesterCreate):
    new_id = get_new_id(session, tssORM)
    dict_data = new_tss.model_dump()
    res = session.query(tssORM).where(and_(tssORM.teacher_id == new_tss.teacher_id,
                                     tssORM.group_id == new_tss.group_id, tssORM.sub_group == new_tss.sub_group,
                                     tssORM.class_type == new_tss.class_type), tssORM.sub_semester_id == new_tss.sub_semester_id).all()
    if res:
        raise HTTPException(status_code=409, detail='Такая сущность уже существует!')
    else:
        new_obj = tssORM(id = new_id, **dict_data)
        session.add(new_obj)
        session.commit()
        return {"OK": 200}


def get_tss_filtered(session: Session, curse: int, group_number: int):

    group_id = get_one_group_id(session, curse, group_number)
    if not group_id:
        pass
    group_id = group_id.get('group_id')
    query = (
        session.query(
            tssORM.id,
            SubjectORM.sub_name,
            TeacherORM.teacher_name,
            TeacherORM.teacher_father_name,
            TeacherORM.teacher_surname,
            tssORM.class_type,
            tssORM.sub_group,
            SyllabusORM.start_year,
            SyllabusORM.speciality
        )
        .select_from(tssORM)
        .join(TeacherORM)
        .join(SubjectSemesterORM)
        .join(SubjectORM)
        .join(SyllabusORM)
        .filter(
            tssORM.group_id == group_id
        )
    )

    res = [dict(zip(['tss_id', 'sub_name', 'teacher_name', 'teacher_father_name', 'teacher_surname',
                     'class_type', 'sub_group', 'start_year', 'speciality' ], i)) for i in query.all()]
    return res


def get_all_classes_info_by_teacher_id(session:Session, teacher_id:int):
    query = (
        session.query(
            tssORM.id,
            SubjectORM.sub_name,
            tssORM.class_type,
            tssORM.sub_group,
            GroupORM.speciality,
            GroupORM.curse,
            GroupORM.number,
            SubjectSemesterORM.has_zachet,
            SubjectSemesterORM.has_exam

        )
        .select_from(tssORM)
        .join(SubjectSemesterORM)
        .join(SubjectORM)
        .join(GroupORM)
        .filter(
            tssORM.teacher_id == teacher_id
        )
    )
    res = [dict(zip(['tss_id', 'sub_name', 'class_type', 'sub_group',  'speciality',
                     'curse', 'number', 'has_zachet', 'has_exam'], i)) for i in query.all()]
    return res


def delete_tss(session:Session, id:int):
    tss_obj = session.get(tssORM, id)
    if not tss_obj:
        raise HTTPException(status_code=404, detail='Нет записи с таким id!')
    try:
        session.delete(tss_obj)
        session.commit()
    except:
        raise HTTPException(status_code=409, detail='Это запись связана с другими ее нельзя удалять!')
    return {'OK': 200}



# Расписание

def get_schedule_filtered(session: Session, group_id: int, n_week: int):
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
        .join(SubjectSemesterORM)
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

def delete_schedule_by_id(session:Session, id:int):
    schedule_obj = session.get(ScheduleORM, id)
    if not schedule_obj:
        raise HTTPException(status_code=404, detail='Нет записи в расписании с таким id!')
    session.delete(schedule_obj)
    session.commit()
    return {'OK': 200}


class NewInSchedule(BaseModel):
    tss_id: int
    group_id: int
    sub_group: Literal[None, 'a', 'b', 'c']
    curse: int
    n_week:List[int]
    n_class: int
    week_day:int
    class_room: int



def check_insert_in_schedule(session:Session, new_obj:NewInSchedule):
    tss_list = session.query(tssORM.id).where(tssORM.group_id == new_obj.group_id).all()
    if not tss_list:
        return None
    tss_id_list = [tss[0] for tss in tss_list]
    teacher_id = session.get(tssORM, new_obj.tss_id).teacher_id
    groups_id_list = [i[0] for i in session.query(GroupORM.id).where(GroupORM.curse == new_obj.curse).all()]
    # проверка, что у группы нет другой пары в данное время
    for week in new_obj.n_week:
        stmt = (session.query(ScheduleORM).where(and_(
            ScheduleORM.n_week == week,
            ScheduleORM.week_day == new_obj.week_day)))
        schedule_list = stmt.where(ScheduleORM.n_class == new_obj.n_class).filter(ScheduleORM.teacher_sub_semester_id.in_(tss_id_list)).all()
        if schedule_list:
            tss_in_schedule = session.get(tssORM, schedule_list[0].teacher_sub_semester_id)
            found_sub_group = tss_in_schedule.sub_group
            print([found_sub_group, new_obj.sub_group])
            if new_obj.sub_group and found_sub_group != new_obj.sub_group:
                pass
            else:
                return 'В это время уже есть пара у данной группы!'
        # проверка, есть ли у препода пара в данное время
        tss_id_list = [i[0] for i in session.query(tssORM.id).
        where(tssORM.teacher_id == teacher_id).all()] # точно не будет пустой записи
        schedule_list = (stmt.where(ScheduleORM.start_time == get_start_time(new_obj.curse, new_obj.n_class))
                         .filter(ScheduleORM.teacher_sub_semester_id.in_(tss_id_list)).all())
        sub_id1, sub_id2 = None, None
        if schedule_list:
            tss_obj1 = session.get(tssORM, schedule_list[0].teacher_sub_semester_id)
            ss_obj1 = session.get(SubjectSemesterORM, tss_obj1.sub_semester_id)
            sub_id1 = ss_obj1.sub_id
            tss_obj2 = session.get(tssORM, new_obj.tss_id)
            ss_obj2 = tss_obj2.sub_semester
            sub_id2 = ss_obj2.sub_id

        if not schedule_list or (sub_id1 == sub_id2 and tss_obj1.sub_group == tss_obj2.sub_group and tss_obj1.group_id in groups_id_list):
            if not schedule_list:
                schedule_list_ = (stmt.where(ScheduleORM.start_time == get_start_time(new_obj.curse, new_obj.n_class))
                             .where(ScheduleORM.class_room == new_obj.class_room)).all()

                if not schedule_list_:
                    pass
                else:
                    return 'Данная аудитория занята в это время'
            else:
                if schedule_list[0].class_room == new_obj.class_room:
                    pass
                else:
                    return 'Неверно указана аудитория'
        else:
            return 'у преподавателя другая пара в это время!'
    return 1



def insert_in_schedule(session:Session, new_obj:NewInSchedule):
    new_id = get_new_id(session, ScheduleORM)
    start_time = get_start_time(new_obj.curse, new_obj.n_class)
    end_time = get_end_time(new_obj.curse, new_obj.n_class)
    check_res = check_insert_in_schedule(session, new_obj)
    if check_res == 1:
        for j, week in enumerate(new_obj.n_week):
            new_schedule_obj = ScheduleORM(id=new_id + j, n_week=week, week_day=new_obj.week_day, n_class=new_obj.n_class,
                                           start_time=start_time, end_time=end_time,
                                           teacher_sub_semester_id=new_obj.tss_id, class_room=new_obj.class_room)
            session.add(new_schedule_obj)
        session.commit()
        return {'OK':200}
    raise HTTPException(status_code=409, detail=check_res)





# Студенты
def get_all_students_from_group_and_sub_group(session:Session, group_id:int, sub_group):
    if sub_group != 'none':
        students = session.query(StudentORM).where(and_(StudentORM.group_id == group_id, StudentORM.sub_group == sub_group)).all()
    else:
        students = session.query(StudentORM).where(StudentORM.group_id == group_id).all()
    return students

# Занятия
def get_all_class_id_for_tss_id(session:Session, tss_id: int):
    res = session.query(ClassORM.id, ClassORM.class_date).where(ClassORM.tss_id == tss_id).order_by(ClassORM.class_date).all()
    class_id_list = [i[0] for i in res]
    class_date_list = [i[1] for i in res]
    return class_id_list, class_date_list


class NewClassAttendance(BaseModel):
    tss_id: int
    class_date: datetime.date
    students_id: List[int]



def insert_new_class_and_attendance(session:Session, new_data: NewClassAttendance):
    print('siii')
    print(new_data.model_dump())
    class_new_id = get_new_id(session, ClassORM)
    new_class = ClassORM(id=class_new_id, tss_id=new_data.tss_id, class_date=new_data.class_date)
    session.add(new_class)
    new_id = get_new_id(session, AttendanceORM)
    for step, student_id in enumerate(new_data.students_id):
        new_attendance_obj = AttendanceORM(id=new_id + step, stud_id=student_id ,class_id=class_new_id, is_attended='П', mark=None, teacher_comment='')
        session.add(new_attendance_obj)
    session.commit()
    return {"OK": 200}


def get_class_id(session:Session, tss_id:int, class_date:Union[datetime, str]):
    class_obj_list = session.query(ClassORM).where(and_(ClassORM.tss_id == tss_id, ClassORM.class_date == class_date)).all()
    if not class_obj_list:
        return None
    else:
        return class_obj_list[0].id

def delete_class(session:Session, class_id:int):
    class_obj = session.get(ClassORM, class_id)
    if not class_obj:
        raise HTTPException(status_code=404, detail='Записи с таким id не существует!')
    session.delete(class_obj)
    session.commit()

# Посещаемость

def all_attendance_data_for_tss(session:Session, tss_id:int, sub_group):
    class_id_list, class_date_list = get_all_class_id_for_tss_id(session, tss_id)
    group_id = get_group_id_from_tss_by_tss_id(session, tss_id)
    students = sorted(get_all_students_from_group_and_sub_group(session, group_id, sub_group), key=lambda x:x.stud_surname)
    total_json_list = []
    for stud in students:
        d = {"stud_id": stud.id, "stud_name": stud.stud_name, "stud_surname": stud.stud_surname,
             "stud_father_name": stud.stud_father_name, 'total_avg_score': stud.total_avg_score}
        attendance_list = session.query(AttendanceORM).where(AttendanceORM.stud_id == stud.id).filter(AttendanceORM.class_id.in_(class_id_list)).order_by(AttendanceORM.id).all()
        if not attendance_list:
            continue
        d['attendance_id_list'] = [i.id for i in attendance_list]
        d["mark_list"] = [i.mark for i in attendance_list]
        d["is_attended_list"] = [i.is_attended for i in attendance_list]
        d['class_id_list'] = class_id_list
        d['class_date_list'] = class_date_list
        total_json_list.append(d)
    return total_json_list



class UpdateMarkAttendance(BaseModel):
    attendance_id_list: List[int]
    new_mark_attendance_list: List[
        Union[
            Literal["П", "У", "Н", "В"],
            conint(ge=0, le=10)
        ]
    ]




def update_mark_or_attendance(session:Session, body: UpdateMarkAttendance):
    for att_id, mark_or_attendance in zip(body.attendance_id_list, body.new_mark_attendance_list):
        att_obj = session.get(AttendanceORM, att_id)
        print(mark_or_attendance)
        if isinstance(mark_or_attendance, int):
            att_obj.mark = mark_or_attendance
        elif isinstance(mark_or_attendance, str):
            att_obj.mark = None
            att_obj.is_attended = mark_or_attendance
    session.commit()





def delete_attendance(session:Session, class_id:int):
    attendance_list = session.query(AttendanceORM).where(AttendanceORM.class_id == class_id).all()
    if not attendance_list:
        raise HTTPException(status_code=404, detail='В таблице нет записей с таким class_id')
    for i in attendance_list:
        session.delete(i)
    session.commit()



# Пользователи

def get_user_by_login(session:Session, login:str):
    user = session.query(UserORM).where(UserORM.login == login).first()
    return user


def get_role(session:Session, user_id:int):
    user = session.get(UserORM, user_id)
    if not user:
        pass
    return user.role


# изменить пароль
def update_password(session: Session, user_id: int, new_password: str) -> None:
    user = session.get(UserORM, user_id)
    if not user:
        raise ValueError("User not found")
    user.password = hash_password(new_password)
    session.commit()

# проверка ролей прав доступа
def check_user_role(session: Session, user_id: int, required_role: str) -> bool:
    user = session.get(UserORM, user_id)
    return user.role == required_role if user else False

# Новая функция для проверки нескольких ролей
def check_user_roles(session: Session, user_id: int, required_roles: list) -> bool:
    user = session.get(UserORM, user_id)
    return user.role in required_roles if user else False














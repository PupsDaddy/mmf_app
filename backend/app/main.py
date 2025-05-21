from fastapi import FastAPI
from backend.app.api.students import router as stud_router
from backend.app.api.groups import router as group_router
from backend.app.api.subjects_semester import router as sub_semester_router
from backend.app.api.subjects import router as sub_router
from backend.app.api.syllabuses import router as sylla_router
from backend.app.api.teachers_subjects_semester import router as tss_router
from backend.app.api.teachers import router as teacher_router
from backend.app.api.schedule import router as schedule_router
from backend.app.api.attendance_classes import router as attendance_classes_router
from backend.app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title='my_mmf', debug=True, description='API_MY_MMF')

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(stud_router)
app.include_router(group_router)
app.include_router(sub_semester_router)
app.include_router(sub_router)
app.include_router(sylla_router)
app.include_router(tss_router)
app.include_router(teacher_router)
app.include_router(schedule_router)
app.include_router(attendance_classes_router)
app.include_router(auth_router)

if __name__ == "__main__":
    uvicorn.run('main:app', reload=True, host="0.0.0.0", port=8000) 
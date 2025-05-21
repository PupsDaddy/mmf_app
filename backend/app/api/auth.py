from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from backend.app.dependencies.database import SessionDep
from backend.app.dependencies.auth import get_current_user, get_current_user_id
from backend.app.crud import get_user_by_login, update_password
from backend.app.auth.utils import validate_password, generate_token_pair, refresh_access_token
from backend.app.schemas.users import UserIn, PasswordChange
from pydantic import BaseModel

router = APIRouter(tags=['Пользователи'], prefix='/users')


@router.post("/login")
async def login(session: SessionDep, form_data: UserIn):
    """
    Аутентификация пользователя и выдача токенов доступа
    """
    user = get_user_by_login(session, form_data.login)
    if not user or not validate_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Неправильный логин или пароль")

    tokens = generate_token_pair({"user_id": user.id, "role": user.role})

    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "token_type": "bearer"
    }


class RefreshToken(BaseModel):
    refresh_token: str


@router.post("/refresh")
async def refresh_token(token_data: RefreshToken = Body(...)):
    """
    Обновление access токена с помощью refresh токена
    """
    try:
        new_access_token = refresh_access_token(token_data.refresh_token)
        return {"access_token": new_access_token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me")
async def get_user_info(current_user: dict = Depends(get_current_user)):
    """
    Получение информации о текущем пользователе
    """
    return {
        "user_id": current_user.get("user_id"),
        "role": current_user.get("role")
    }


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    session: SessionDep,
    user_id: int = Depends(get_current_user_id)
):
    """
    Изменение пароля текущего пользователя
    """
    user = get_user_by_login(session, password_data.login)
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if user.id != user_id:
        raise HTTPException(status_code=403, detail="Вы можете изменить только свой пароль")
    
    if not validate_password(password_data.old_password, user.password):
        raise HTTPException(status_code=400, detail="Неверный текущий пароль")
    
    try:
        update_password(session, user_id, password_data.new_password)
        return {"message": "Пароль успешно изменен"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при изменении пароля: {str(e)}")


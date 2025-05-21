from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.auth.utils import decode_jwt
from backend.app.dependencies.database import SessionDep
from backend.app.crud import check_user_role
from typing import List, Optional

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Проверяет JWT токен и возвращает данные пользователя
    """
    try:
        payload = decode_jwt(credentials.credentials, token_type="access")
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Ошибка аутентификации: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user_id(current_user: dict = Depends(get_current_user)) -> int:
    """
    Возвращает ID текущего пользователя
    """
    return current_user.get("user_id")

async def get_current_user_role(current_user: dict = Depends(get_current_user)) -> str:
    """
    Возвращает роль текущего пользователя
    """
    return current_user.get("role")

async def check_roles(
    required_roles: List[str],
    current_role: str = Depends(get_current_user_role),
) -> None:
    """
    Проверяет, имеет ли текущий пользователь одну из требуемых ролей
    """
    if current_role not in required_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Недостаточно прав доступа. Требуется одна из ролей: {', '.join(required_roles)}",
        )

# Зависимости для проверки конкретных ролей
async def admin_required(current_role: str = Depends(get_current_user_role)):
    if current_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права администратора"
        )

async def teacher_required(current_role: str = Depends(get_current_user_role)):
    if current_role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права преподавателя"
        )

async def student_required(current_role: str = Depends(get_current_user_role)):
    if current_role != "stud":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права студента"
        )

# Зависимость для проверки, имеет ли пользователь доступ к ресурсам другого пользователя
async def check_user_access(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    session: SessionDep = Depends(),
) -> None:
    """
    Проверяет, имеет ли текущий пользователь доступ к ресурсам указанного пользователя.
    Администраторы имеют доступ ко всем ресурсам.
    Обычные пользователи имеют доступ только к своим ресурсам.
    """
    # Администраторы имеют доступ ко всем ресурсам
    if current_user.get("role") == "admin":
        return
    
    # Пользователи имеют доступ только к своим ресурсам
    if current_user.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к ресурсам другого пользователя"
        ) 
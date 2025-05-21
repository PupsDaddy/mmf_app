from datetime import datetime, timedelta
import bcrypt
import jwt
from backend.app.config import settings


def encode_jwt(
        payload: dict,
        secret_key: str = settings.auth_jwt.secret_key,
        algorithm: str = settings.auth_jwt.algorithm,
        expire_minutes: int = None,
        expire_timedelta: timedelta = None,
        token_type: str = "access"
) -> str:
    to_encode = payload.copy()
    now = datetime.utcnow()


    if token_type == "refresh":
        expire_timedelta = timedelta(days=settings.auth_jwt.refresh_token_expire_days)
    elif not expire_timedelta:
        expire_minutes = expire_minutes or settings.auth_jwt.access_token_expire_minutes
        expire_timedelta = timedelta(minutes=expire_minutes)

    expire = now + expire_timedelta

    to_encode.update(
        exp=expire,
        iat=now,
        type=token_type
    )

    return jwt.encode(
        to_encode,
        secret_key,
        algorithm=algorithm,
    )


def decode_jwt(
        token: str | bytes,
        secret_key: str = settings.auth_jwt.secret_key,
        algorithm: str = settings.auth_jwt.algorithm,
        token_type: str = None
) -> dict:
    try:
        decoded = jwt.decode(
            token,
            secret_key,
            algorithms=[algorithm],
        )
        
        if token_type and decoded.get("type") != token_type:
            raise ValueError(f"Invalid token type. Expected {token_type}")
        
        return decoded
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
    except Exception as e:
        raise ValueError(f"Token decode failed: {str(e)}")





def generate_token_pair(
        payload: dict,
        access_token_expire: timedelta = None,
        refresh_token_expire: timedelta = None
) -> dict[str, str]:

    base_payload = payload.copy()

    base_payload.pop("exp", None)
    base_payload.pop("iat", None)
    base_payload.pop("type", None)

    access_token = encode_jwt(
        payload=base_payload,
        token_type="access",
        expire_timedelta=access_token_expire
    )

    refresh_token = encode_jwt(
        payload=base_payload,
        token_type="refresh",
        expire_timedelta=refresh_token_expire or timedelta(days=30)
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


def hash_password(password: str) -> str:

    salt = bcrypt.gensalt()
    pwd_bytes = password.encode()
    return bcrypt.hashpw(pwd_bytes, salt).decode()


def validate_password(password: str, hashed_password: str) -> bool:
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode()
    return bcrypt.checkpw(
        password=password.encode(),
        hashed_password=hashed_password
    )


from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import jwt
from backend.app.config import settings

security = HTTPBearer()


def refresh_access_token(refresh_token: str) -> str:
    try:
        decoded = decode_jwt(refresh_token, token_type="refresh")
        new_payload = {
            "user_id": decoded["user_id"],
            "role": decoded.get("role")
        }

        # Генерируем новый access token
        return encode_jwt(
            payload=new_payload,
            token_type="access",
            expire_timedelta=timedelta(minutes=settings.auth_jwt.access_token_expire_minutes)
        )

    except jwt.ExpiredSignatureError:
        raise ValueError("Refresh token expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid refresh token")
    except Exception as e:
        raise ValueError(f"Refresh failed: {str(e)}")


def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        token_type: Optional[str] = None
) -> dict:
    token = credentials.credentials

    try:
        payload = decode_jwt(token, token_type=token_type)
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (jwt.InvalidTokenError, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


print(hash_password('vamos'))
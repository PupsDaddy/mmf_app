import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Config:
    DATABASE_URL = (f'{os.getenv("DB_DRIVER")}://{os.getenv("DB_USER")}'
                    f':{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}'
                    f':{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}')




class AuthJWT(BaseModel):
    algorithm: str = "HS256"
    secret_key: str = os.getenv('JWT_SECRET_KEY', 'your_super_secret_key_change_this_in_production')
    access_token_expire_minutes: int = 10
    refresh_token_expire_days: int = 10
    token_type: str = "Bearer"





class Settings(BaseModel):
    auth_jwt: AuthJWT = AuthJWT()


settings = Settings()
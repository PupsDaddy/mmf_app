from typing import Literal

from pydantic import BaseModel, Field


class User(BaseModel):
    id: int
    login: str = Field(max_length=70)
    password: str = Field(max_length=70)
    role: Literal['stud', 'teacher', 'admin']


class UserIn(BaseModel):
    login: str = Field(max_length=70)
    password: str = Field(max_length=70)


class PasswordChange(BaseModel):
    login: str = Field(max_length=70)
    old_password: str = Field(max_length=70)
    new_password: str = Field(max_length=70)


class UserCreate(BaseModel):
    login: str = Field(max_length=70)
    password: str = Field(max_length=70)
    role: Literal['stud', 'teacher', 'admin']


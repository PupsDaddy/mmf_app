"""Add table Users

Revision ID: 16fef23dc1d4
Revises: 
Create Date: 2025-05-20 23:42:07.624873

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM


# revision identifiers, used by Alembic.
revision: str = '16fef23dc1d4'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('Users',
                    sa.Column('id', sa.Integer(), autoincrement='auto', primary_key=True),
                    sa.Column('login', sa.String(60), nullable=False),
                    sa.Column('hashed_password', sa.String(255), nullable=False),
                    sa.Column('role', ENUM('stud', 'teacher', 'admin', name='role'), nullable=False))



def downgrade() -> None:
    op.drop_table('Users')

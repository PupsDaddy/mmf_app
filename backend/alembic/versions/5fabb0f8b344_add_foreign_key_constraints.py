"""add foreign key constraints

Revision ID: 5fabb0f8b344
Revises: 16fef23dc1d4
Create Date: 2025-05-21 00:10:50.979920

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5fabb0f8b344'
down_revision: Union[str, None] = '16fef23dc1d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_foreign_key(
        constraint_name="fk_stud_user_id",
        source_table="Students",
        referent_table="Users",
        local_cols=["id"],
        remote_cols=["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        constraint_name="fk_teacher_user_id",
        source_table="Teachers",
        referent_table="Users",
        local_cols=["id"],
        remote_cols=["id"],
        ondelete="CASCADE",
    )



def downgrade() -> None:
    op.drop_constraint(
        constraint_name="fk_stud_user_id",
        table_name="Students",
        type_="foreignkey",
    )

    op.drop_constraint(
        constraint_name="fk_teacher_user_id",
        table_name="Teachers",
        type_="foreignkey",
    )

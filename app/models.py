from datetime import date, datetime
from sqlalchemy import String, Boolean, Text, Date, DateTime, func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.ext.asyncio import AsyncAttrs
from pydantic import ConfigDict
from sqlalchemy import inspect
from typing import Optional

class ReprMixin:
    def __repr__(self) -> str:
        cls = self.__class__
        columns = inspect(cls).columns.keys()
        values = ', '.join(f"{col}={getattr(self, col)!r}" for col in columns)
        return f"<{cls.__name__}({values})>"

    def to_dict(self) -> dict:
        result = {}
        for col in inspect(self.__class__).columns.keys():
            value = getattr(self, col)
            if isinstance(value, (date, datetime)):
                result[col] = value.isoformat()
            else:
                result[col] = value
        return result

class Base(AsyncAttrs, DeclarativeBase, ReprMixin):
    class Config:
        model_config = ConfigDict(from_attributes=True)

class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    is_completed: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default=text('false'), nullable=False, index=True
    )
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

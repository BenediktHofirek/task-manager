from datetime import date
from pydantic import BaseModel, ConfigDict
from fastapi_camelcase import CamelModel

class BaseSchema(CamelModel):
    pass

class TodoBase(BaseSchema):
    title: str
    description: str
    is_completed: bool
    due_date: date | None

class TodoCreateSchema(TodoBase):
    is_completed: bool | None = False

class TodoUpdateSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = None
    due_date: date | None = None

class TodoSchema(TodoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

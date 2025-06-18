from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from fastapi_camelcase import CamelModel

class BaseSchema(CamelModel):
    pass

class TodoBase(BaseSchema):
    title: str = Field(min_length=4, max_length=255)
    description: str
    is_completed: bool
    due_date: date | None

class TodoCreateSchema(TodoBase):
    is_completed: bool = False
    description: str = ""

class TodoUpdateSchema(BaseModel):
    title: str | None = Field(default=None, min_length=4, max_length=255)
    description: str | None = None
    is_completed: bool | None = None
    due_date: date | None = None

class TodoSchema(TodoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

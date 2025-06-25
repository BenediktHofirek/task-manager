from app.schemas import TodoUpdateSchema
from fastapi import APIRouter, status
from app.dependencies import DbSession
from sqlalchemy import select
from app.schemas import TodoSchema
from app.models import Todo
from app.schemas import TodoCreateSchema
from app.dependencies import UserId
from app.exceptions import NotFoundException
import asyncio

router = APIRouter()

@router.get("/todos")
async def get_todos(db: DbSession, user_id: UserId) -> list[TodoSchema]:
    result = await db.execute(select(Todo).where(Todo.user_id == user_id))

    await asyncio.sleep(3)

    todos = result.scalars().all()
    return todos

@router.get("/todos/{id}")
async def get_todo_by_id(db: DbSession, user_id: UserId, id: int) -> TodoSchema:
    result = await db.execute(select(Todo).where(Todo.id == id, Todo.user_id == user_id))
    todo = result.scalar_one_or_none()
    await asyncio.sleep(3)

    if not todo:
        raise NotFoundException()

    return todo

@router.put("/todos/{id}")
async def update_todo(db: DbSession, dto: TodoUpdateSchema, user_id: UserId, id: int) -> TodoSchema:
    result = await db.execute(select(Todo).where(Todo.id == id, Todo.user_id == user_id))
    todo = result.scalar_one_or_none()

    await asyncio.sleep(3)
    if not todo:
        raise NotFoundException()

    for key, value in dto.model_dump(exclude_unset=True).items():
        setattr(todo, key, value)

    await db.commit()
    await db.refresh(todo)
    return todo

@router.post("/todos", status_code=status.HTTP_201_CREATED)
async def create_todo(db: DbSession, dto: TodoCreateSchema, user_id: UserId) -> TodoSchema:
    todo = Todo(**dto.model_dump(), user_id=user_id)
    await asyncio.sleep(3)

    db.add(todo)
    await db.commit()
    await db.refresh(todo)

    return todo

@router.delete("/todos/{id}", status_code=status.HTTP_204_NO_CONTENT) 
async def delete_todo(db: DbSession, user_id: UserId, id: int) -> None: 
    result = await db.execute(select(Todo).where(Todo.id == id, Todo.user_id == user_id))
    todo = result.scalar_one_or_none()
    await asyncio.sleep(3)

    if not todo:
        raise NotFoundException()

    await db.delete(todo)
    await db.commit()

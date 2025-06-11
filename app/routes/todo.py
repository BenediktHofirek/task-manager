from app.schemas import TodoUpdateSchema
from fastapi import APIRouter, HTTPException, status
from app.dependencies import DBSessionDep
from sqlalchemy import select
from app.schemas import TodoSchema
from app.models import Todo
from app.schemas import TodoCreateSchema

router = APIRouter()

@router.get("/todos")
async def get_todos(db: DBSessionDep) -> list[TodoSchema]:
    result = await db.execute(select(Todo))

    todos = result.scalars().all()
    return todos

@router.get("/todos/{id}")
async def get_todo_by_id(db: DBSessionDep, id: int) -> TodoSchema:
    result = await db.execute(select(Todo).where(Todo.id == id))
    todo = result.scalar_one_or_none()

    if not todo:
        raise HTTPException(status_code=404)

    return todo

@router.put("/todos/{id}")
async def update_todo(db: DBSessionDep, dto: TodoUpdateSchema, id: int) -> TodoSchema:
    todo = (await db.execute(select(Todo).where(Todo.id == id))).scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=404)

    for key, value in dto.model_dump(exclude_unset=True).items():
        setattr(todo, key, value)
    await db.commit()
    await db.refresh(todo)
    return todo

@router.post("/todos", status_code=status.HTTP_201_CREATED)
async def create_todo(db: DBSessionDep, dto: TodoCreateSchema) -> TodoSchema:
    todo = Todo(**dto.model_dump())

    db.add(todo)
    await db.commit()
    await db.refresh(todo)

    return todo

@router.delete("/todos/{id}", status_code=status.HTTP_204_NO_CONTENT) 
async def delete_todo(db: DBSessionDep, id: int) -> None: 
    todo = (await db.execute(select(Todo).where(Todo.id == id))).scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=404)

    await db.delete(todo)

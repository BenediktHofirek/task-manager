from tests.factories import todo_factory
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

TODO_COUNT = 10
todos = []

async def seed_db(db: AsyncSession):
        for _ in range(TODO_COUNT):
            todo = todo_factory()
            db.add(todo)
            todos.append(todo)

        await db.commit()
        for todo in todos:
            await db.refresh(todo)

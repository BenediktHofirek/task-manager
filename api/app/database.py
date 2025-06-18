from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator
from .config import settings

DATABASE_URL = (
    f"postgresql+asyncpg://{settings.db.user}:{settings.db.password.get_secret_value()}"
    f"@{settings.db.host}:{settings.db.port}/{settings.db.name}"
)

class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self._engine = create_async_engine(host, **engine_kwargs)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine)

    async def close(self):
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self._engine.dispose()

        self._engine = None
        self._sessionmaker = None

    @asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

    @asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


sessionmanager = DatabaseSessionManager(
    DATABASE_URL,
    engine_kwargs={
        'pool_size': settings.db.connection_count,
        'max_overflow': settings.db.connection_overflow,
        'pool_timeout': 5,
        'pool_recycle': 1800,
        'pool_pre_ping': True,
        'echo': True,
        'future': True
    }
)


async def get_db_session():
    async with sessionmanager.session() as session:
        yield session

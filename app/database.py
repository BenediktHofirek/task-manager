from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator
from .config import config

DATABASE_URL = (
    f"postgresql+asyncpg://{config['DB_USER']}:{config['DB_PASSWORD']}"
    f"@{config['DB_HOST']}:{config['DB_PORT']}/{config['DB_NAME']}"
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
        'pool_size': int(config['DB_CONNECTION_COUNT']),
        'max_overflow': int(config['DB_CONNECTION_OVERFLOW']),
        'pool_timeout': 30,
        'pool_pre_ping': True,
        'echo': True,
        'future': True
    }
)


async def get_db_session():
    async with sessionmanager.session() as session:
        yield session

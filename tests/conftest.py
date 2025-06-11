from tests.seed import seed_db
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy import (
    event
)
from app.main import app
from app.database import get_db_session
from app.models import Base
import pytest
import asyncio

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

# Setup test engine/session
test_engine = create_async_engine(TEST_DB_URL, connect_args={"check_same_thread": False })
TestSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

@pytest.fixture(scope='session')
def event_loop():
    """
    Creates an instance of the default event loop for the test session.
    """
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

        async with TestSessionLocal(bind=conn) as async_session:
            await seed_db(async_session)


@pytest_asyncio.fixture(scope="function")
async def client():
    """The expectation with async_sessions is that the
    transactions be called on the connection object instead of the
    session object. 
    Detailed explanation of async transactional tests
    <https://github.com/sqlalchemy/sqlalchemy/issues/5811>
    """

    async with test_engine.connect() as connection: 
        trans = await connection.begin()
        async with TestSessionLocal(bind=connection) as async_session:
            nested = await connection.begin_nested()

            @event.listens_for(async_session.sync_session, "after_transaction_end")
            def end_savepoint(session, transaction):
                nonlocal nested

                if not nested.is_active:
                    nested = connection.sync_connection.begin_nested()

            app.dependency_overrides[get_db_session] = lambda: async_session

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000/api") as c:
                yield c

            await trans.rollback()

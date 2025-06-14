from fastapi import FastAPI
from .routes import todo
from contextlib import asynccontextmanager
from app.database import sessionmanager
from app.utils import use_route_names_as_operation_ids

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Function that handles startup and shutdown events.
    To understand more, read https://fastapi.tiangolo.com/advanced/events/
    """
    yield
    if sessionmanager._engine is not None:
        await sessionmanager.close()


app = FastAPI(lifespan=lifespan, title="Todo api", docs_url="/api/docs")

app.include_router(todo.router, prefix='/api')

use_route_names_as_operation_ids(app)

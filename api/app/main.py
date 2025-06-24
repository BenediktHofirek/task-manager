from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import sessionmanager
from app.utils import use_route_names_as_operation_ids

from .routes import todo
from .middleware import AuthMiddleware
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Function that handles startup and shutdown events.
    To understand more, read https://fastapi.tiangolo.com/advanced/events/
    """
    yield
    if sessionmanager._engine is not None:
        await sessionmanager.close()

app = FastAPI(
    lifespan=lifespan,
    title="Todo api",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

origins = [
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuthMiddleware)

@app.get('/health')
async def health():
    return { "status": "healthy" }


app.include_router(todo.router, prefix="/api")

use_route_names_as_operation_ids(app)

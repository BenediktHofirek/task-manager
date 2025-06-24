from typing import Annotated, List
from pydantic import BaseModel

from app.database import get_db_session
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

DbSession = Annotated[AsyncSession, Depends(get_db_session)]

# Auth
def get_user_id(request: Request) -> str:
    return request.state.user_id

def get_token_payload(request: Request) -> dict:
    return request.state.token_payload

class AuthTokenPayload(BaseModel):
    iss: str
    sub: str
    aud: str | List[str]
    iat: int
    exp: int
    scope: str | None = None
    permissions: List[str] | None = None
    azp: str | None = None

UserId = Annotated[str, Depends(get_user_id)]
AuthToken = Annotated[AuthTokenPayload, Depends(get_token_payload)]


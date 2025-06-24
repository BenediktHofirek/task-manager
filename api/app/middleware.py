from starlette.middleware.base import BaseHTTPMiddleware 
from fastapi import Request
from .auth import auth

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Only protect /api/todos endpoints
        if not path.startswith("/api/todos"):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return self._unauthorized_response("Missing or malformed Authorization header")

        token = auth_header.split(" ")[1]

        payload = auth.decode_token(token)

        # Attach user info to request
        request.state.user_id = payload.get("sub")
        request.state.token_payload = payload

        response = await call_next(request)
        return response

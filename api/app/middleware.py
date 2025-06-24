from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from .auth import auth
from .exceptions import UnauthenticatedException

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        if not path.startswith("/api/todos"):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise UnauthenticatedException

        token = auth_header.split(" ")[1]

        print(f"Token: {token}")
        payload = auth.decode_token(token)

        # Attach to request.state
        request.state.user_id = payload.get("sub")
        request.state.token_payload = payload

        response = await call_next(request)
        return response


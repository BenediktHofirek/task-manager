from fastapi import HTTPException, status

class ForbiddenException(HTTPException):
    def __init__(self, detail: str = "You are not allowed to access this resource", **kwargs):
        super().__init__(status.HTTP_403_FORBIDDEN, detail=detail)


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Requires authentication"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
        )

class NotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND, detail="Not found"
        )

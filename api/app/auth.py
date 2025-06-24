import jwt
from jwt import PyJWKClient

from .config import settings
from .exceptions import UnauthorizedException

class VerifyToken:
    def __init__(self):
        jwks_url = f"https://{settings.auth.auth0_domain}/.well-known/jwks.json"
        self.jwks_client = PyJWKClient(jwks_url)

    def decode_token(self, token: str):
        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(token).key
        except jwt.exceptions.PyJWKClientError as error:
            raise UnauthorizedException(str(error))

        try:
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=settings.auth.auth0_algorithms,
                audience=settings.auth.auth0_api_audience,
                issuer=settings.auth.auth0_issuer,
            )
        except jwt.PyJWTError as error:
            raise UnauthorizedException(str(error))

        return payload

auth = VerifyToken()

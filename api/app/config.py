from pydantic import BaseModel, SecretStr
from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)

class DatabaseSettings(BaseModel):
    name: str
    user: str
    password: SecretStr
    host: str
    port: int
    connection_count: int
    connection_overflow: int

class AuthSettings(BaseModel):
    auth0_domain: str
    auth0_algorithms: str
    auth0_api_audience: str
    auth0_issuer: str

class Settings(BaseSettings):
    db: DatabaseSettings
    auth: AuthSettings

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_nested_delimiter="__"
    )

settings = Settings()

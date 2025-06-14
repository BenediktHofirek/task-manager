from pydantic import BaseModel, Field, SecretStr
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


class Settings(BaseSettings):
    db: DatabaseSettings

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_nested_delimiter="__"
    )

settings = Settings()

"""Application configuration loaded from environment variables / .env file."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+psycopg://pawai_user:pawai_password@localhost:5432/pawai"
    test_database_url: str = "postgresql+psycopg://pawai_user:pawai_password@localhost:5432/pawai_test"

    session_cookie_name: str = "pawai_session"
    session_ttl_minutes: int = 10080  # 7 days
    session_cookie_secure: bool = False

    cors_origins: str = "http://localhost:5500,http://127.0.0.1:5500"
    environment: str = "development"
    rate_limit_enabled: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

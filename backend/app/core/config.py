from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "EcoLens AI API"
    app_version: str = "0.1.0"
    environment: str = "development"

    frontend_url: str = "http://localhost:3000"

    database_url: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/ecolens"
    )

    jwt_secret: str = "change-this-development-secret"
    access_token_expire_minutes: int = 1440

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()

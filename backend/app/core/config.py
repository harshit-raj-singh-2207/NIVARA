from typing import List, Union, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator, model_validator, AliasChoices

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareMate AI Core Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = Field(default="development", validation_alias=AliasChoices("ENVIRONMENT", "ENV"))
    DEBUG: bool = True

    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    MONGODB_URI: str = Field(
        default="mongodb://localhost:27017",
        validation_alias=AliasChoices("MONGODB_URI", "MONGODB_URL")
    )
    DATABASE_NAME: str = Field(default="caremate_db", alias="DATABASE_NAME")

    # Security & JWT
    JWT_SECRET: str = Field(
        default="caremate_super_secret_jwt_key_998877665544332211",
        validation_alias=AliasChoices("JWT_SECRET", "SECRET_KEY")
    )
    JWT_ALGORITHM: str = Field(default="HS256", alias="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=10080, alias="ACCESS_TOKEN_EXPIRE_MINUTES") # 7 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = Field(default=43200, alias="REFRESH_TOKEN_EXPIRE_MINUTES") # 30 days

    # CORS Origins
    FRONTEND_ORIGIN: str = Field(default="http://localhost:8081", alias="FRONTEND_ORIGIN")
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:19006",
        "http://localhost:3000",
        "*"
    ]

    @property
    def ENV(self) -> str:
        return self.ENVIRONMENT

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        if isinstance(v, list):
            return v
        return ["http://localhost:8081", "http://localhost:8082"]

    # Email Service Config (Optional)
    SMTP_HOST: Optional[str] = Field(default=None, alias="SMTP_HOST")
    SMTP_PORT: Optional[int] = Field(default=587, alias="SMTP_PORT")
    SMTP_USERNAME: Optional[str] = Field(default=None, alias="SMTP_USERNAME")
    SMTP_PASSWORD: Optional[str] = Field(default=None, alias="SMTP_PASSWORD")
    EMAIL_FROM: str = Field(default="no-reply@caremate.ai", alias="EMAIL_FROM")

    # Notification Service Config (Optional)
    NOTIFICATION_PROVIDER: str = Field(default="mock", alias="NOTIFICATION_PROVIDER")
    EXPO_PUSH_API_URL: str = "https://exp.host/--/api/v2/push/send"

    @model_validator(mode="after")
    def validate_required_settings(self) -> "Settings":
        required_fields = {
            "MONGODB_URI": self.MONGODB_URI,
            "DATABASE_NAME": self.DATABASE_NAME,
            "JWT_SECRET": self.JWT_SECRET,
            "JWT_ALGORITHM": self.JWT_ALGORITHM,
            "ACCESS_TOKEN_EXPIRE_MINUTES": self.ACCESS_TOKEN_EXPIRE_MINUTES,
            "FRONTEND_ORIGIN": self.FRONTEND_ORIGIN,
        }
        for name, value in required_fields.items():
            if value is None or str(value).strip() == "":
                raise ValueError(f"Required configuration variable '{name}' is missing!")
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()


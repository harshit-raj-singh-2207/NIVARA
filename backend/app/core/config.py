"""
Application configuration loaded from environment variables.
Uses pydantic-settings for type-safe, validated settings.
"""

from functools import lru_cache
from typing import List, Optional, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application Settings loaded from environment variables or defaults."""

    # Core Application Metadata
    PROJECT_NAME: str = Field(
        default="NIVARA AI Communication, Learning & Safety System",
        description="Name of the application"
    )
    API_V1_STR: str = Field(
        default="/api/v1",
        description="API Version 1 URL prefix"
    )
    ENVIRONMENT: str = Field(
        default="development",
        description="Environment mode: development, staging, production"
    )
    DEBUG: bool = Field(
        default=True,
        description="Debug mode flag"
    )

    # Server Configuration
    HOST: str = Field(default="0.0.0.0", description="Host address to bind the server")
    PORT: int = Field(default=8000, description="Port to run the backend server")
    CORS_ORIGINS: Union[List[str], str] = Field(
        default=["http://localhost:3000", "http://localhost:8080", "http://localhost:19006", "*"],
        description="Allowed origins for CORS policy"
    )

    # MongoDB Database Configuration
    MONGODB_URL: str = Field(
        default="mongodb://localhost:27017",
        description="MongoDB connection string URI"
    )
    DATABASE_NAME: str = Field(
        default="nivara_db",
        description="Target MongoDB database name"
    )
    MONGODB_MIN_POOL_SIZE: int = Field(
        default=10,
        description="Minimum database connection pool size"
    )
    MONGODB_MAX_POOL_SIZE: int = Field(
        default=100,
        description="Maximum database connection pool size"
    )

    # Optional OpenAI-compatible AI provider. No key is required for non-AI endpoints.
    AI_API_KEY: Optional[str] = Field(default=None, description="AI provider API key")
    AI_MODEL: str = Field(default="gpt-4o-mini", description="AI model identifier")
    AI_BASE_URL: str = Field(default="https://api.openai.com/v1", description="OpenAI-compatible API base URL")
    AI_TIMEOUT_SECONDS: float = Field(default=20.0, ge=1.0, le=120.0)

    # Security & JWT Token Parameters
    SECRET_KEY: str = Field(
        default="nivara_super_secret_jwt_key_change_in_production_32bytes!",
        description="Secret key used for signing JWT tokens"
    )
    JWT_ALGORITHM: str = Field(
        default="HS256",
        description="Hashing algorithm for JWT token signing"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60 * 24 * 7,  # 7 Days
        description="Access token lifespan in minutes"
    )
    REFRESH_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60 * 24 * 30,  # 30 Days
        description="Refresh token lifespan in minutes"
    )

    # Sensor & Wearable Safety Settings
    GEOFENCE_DEFAULT_RADIUS_METERS: float = Field(
        default=500.0,
        description="Default safe zone radius in meters for GPS Wearable system"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    """Returns the cached singleton Settings instance."""
    return Settings()


settings = get_settings()

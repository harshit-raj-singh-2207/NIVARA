"""
Main FastAPI Application Entry Point for NIVARA backend.
Configures CORS, global rate limiting, exception handlers, async database lifespan, and API v1 routing.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.database import close_db, init_db
from app.core.exception_handlers import register_exception_handlers
from app.infrastructure.logging.logger import get_logger
from app.middleware.rate_limit import RateLimitMiddleware

logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan Context Manager.
    Executes database pool initialization and Beanie document registration on startup,
    and handles graceful teardown on shutdown.
    """
    logger.info("==================================================")
    logger.info(f"Starting {settings.PROJECT_NAME} backend service ({settings.ENVIRONMENT})...")
    logger.info("==================================================")

    # Initialize MongoDB connection pool & Beanie ODM
    await init_db()

    yield

    logger.info("Initiating graceful shutdown for NIVARA backend service...")
    # Close MongoDB connection pool
    await close_db()
    logger.info("NIVARA backend service successfully shut down.")


# Initialize FastAPI application instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Communication, Learning & Safety Ecosystem Backend API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# 1. CORS Middleware Configuration for React Native and Web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Rate Limiting Middleware
app.add_middleware(
    RateLimitMiddleware,
    max_requests=120,
    window_seconds=60,
)

# 3. Global Exception Handler Registration
register_exception_handlers(app)

# 4. Mount Central API v1 Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health Check"])
async def health_check():
    """Health check endpoint verifying application operational status."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0",
    }

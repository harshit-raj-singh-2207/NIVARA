from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db, close_mongo_connection
from app.core.middleware import LoggingAndTimingMiddleware
from app.core.exceptions import NivaraException
from app.core.exception_handlers import (
    nivara_exception_handler,
    validation_exception_handler,
    global_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from app.api.v1.router import api_v1_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("==================================================")
    print(f"Starting {settings.PROJECT_NAME} backend service ({settings.ENV})...")
    print("==================================================")
    await init_db()
    yield
    await close_mongo_connection()
    print("Shutting down NIVARA Backend Server...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Middlewares
app.add_middleware(LoggingAndTimingMiddleware)

# Exception Handlers
app.add_exception_handler(NivaraException, nivara_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Include Routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENV,
        "status": "running",
        "docs": f"{settings.API_V1_STR}/docs"
    }

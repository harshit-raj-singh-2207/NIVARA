import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"Starting NIVARA FastAPI Backend Server at http://{settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )

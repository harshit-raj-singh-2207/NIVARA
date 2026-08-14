from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.exceptions import BaseAppException

async def nivara_exception_handler(request: Request, exc: BaseAppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            }
        },
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Format field errors into readable summary
    formatted_errors = []
    for err in errors:
        loc = " -> ".join([str(p) for p in err.get("loc", [])])
        formatted_errors.append(f"{loc}: {err.get('msg')}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request payload",
                "details": formatted_errors,
            }
        },
    )

async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected internal server error occurred",
            }
        },
    )

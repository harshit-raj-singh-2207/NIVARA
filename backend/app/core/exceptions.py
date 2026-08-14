from typing import Optional, Any, Dict

class BaseAppException(Exception):
    def __init__(self, message: str, code: str = "INTERNAL_ERROR", status_code: int = 500, details: Optional[Any] = None):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)

class AuthenticationError(BaseAppException):
    def __init__(self, message: str = "Authentication failed", code: str = "AUTHENTICATION_ERROR"):
        super().__init__(message=message, code=code, status_code=401)

class AuthorizationError(BaseAppException):
    def __init__(self, message: str = "Operation not permitted", code: str = "AUTHORIZATION_ERROR"):
        super().__init__(message=message, code=code, status_code=403)

class ResourceNotFoundError(BaseAppException):
    def __init__(self, message: str = "Resource not found", code: str = "NOT_FOUND"):
        super().__init__(message=message, code=code, status_code=404)

class ValidationError(BaseAppException):
    def __init__(self, message: str = "Validation error", code: str = "VALIDATION_ERROR", details: Optional[Any] = None):
        super().__init__(message=message, code=code, status_code=400, details=details)

class ConflictError(BaseAppException):
    def __init__(self, message: str = "Resource already exists", code: str = "CONFLICT_ERROR"):
        super().__init__(message=message, code=code, status_code=409)

class ExternalServiceError(BaseAppException):
    def __init__(self, message: str = "External service error", code: str = "EXTERNAL_SERVICE_ERROR"):
        super().__init__(message=message, code=code, status_code=502)

# Aliases for backward compatibility
NivaraException = BaseAppException
NotFoundException = ResourceNotFoundError
UnauthorizedException = AuthenticationError
ForbiddenException = AuthorizationError
BadRequestException = ValidationError
DuplicateResourceException = ConflictError

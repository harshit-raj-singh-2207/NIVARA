"""Small provider-independent client for OpenAI-compatible chat APIs."""

import logging

import httpx

from app.core.config import settings
from app.core.exceptions import AppException


logger = logging.getLogger(__name__)


class AIProviderError(AppException):
    def __init__(self, message: str = "The AI assistant is temporarily unavailable", code: str = "AI_PROVIDER_ERROR", status_code: int = 503) -> None:
        super().__init__(message=message, code=code, status_code=status_code)


class AIConfigurationError(AIProviderError):
    def __init__(self) -> None:
        super().__init__("AI features are not configured on this server.", "AI_NOT_CONFIGURED", 503)


class AIAuthenticationError(AIProviderError):
    def __init__(self) -> None:
        super().__init__("The AI provider rejected its configured credentials.", "AI_PROVIDER_AUTH_FAILED", 502)


class AIRateLimitError(AIProviderError):
    def __init__(self) -> None:
        super().__init__("The AI provider is busy. Please try again shortly.", "AI_RATE_LIMITED", 503)


class AITimeoutError(AIProviderError):
    def __init__(self) -> None:
        super().__init__("The AI provider took too long to respond.", "AI_PROVIDER_TIMEOUT", 504)


class AIResponseError(AIProviderError):
    def __init__(self, message: str = "The AI provider returned an invalid response.") -> None:
        super().__init__(message, "AI_INVALID_RESPONSE", 502)


class AIClient:
    async def complete(self, system: str, user: str) -> str:
        if not settings.AI_API_KEY:
            logger.error("AI request blocked: required setting AI_API_KEY is missing or empty")
            raise AIConfigurationError()
        payload = {"model": settings.AI_MODEL, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}], "temperature": 0.3}
        headers = {"Authorization": f"Bearer {settings.AI_API_KEY}"}
        try:
            async with httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS) as client:
                response = await client.post(f"{settings.AI_BASE_URL.rstrip('/')}/chat/completions", json=payload, headers=headers)
                if response.status_code in (401, 403):
                    logger.error("AI provider authentication rejected (HTTP %s)", response.status_code)
                    raise AIAuthenticationError()
                if response.status_code == 429:
                    logger.warning("AI provider rate limit reached")
                    raise AIRateLimitError()
                if response.status_code >= 500:
                    logger.warning("AI provider unavailable (HTTP %s)", response.status_code)
                    raise AIProviderError()
                if response.status_code >= 400:
                    logger.error("AI provider rejected request (HTTP %s); check AI_MODEL and AI_BASE_URL", response.status_code)
                    raise AIProviderError("The AI provider rejected the configured request.", "AI_REQUEST_REJECTED", 502)
                content = response.json()["choices"][0]["message"]["content"]
                if not isinstance(content, str) or not content.strip():
                    raise ValueError("empty completion")
                return content.strip()
        except AIProviderError:
            raise
        except httpx.TimeoutException as exc:
            logger.warning("AI provider timed out after %s seconds", settings.AI_TIMEOUT_SECONDS)
            raise AITimeoutError() from exc
        except httpx.RequestError as exc:
            logger.warning("AI provider network request failed: %s", type(exc).__name__)
            raise AIProviderError() from exc
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            logger.error("AI provider response could not be parsed: %s", type(exc).__name__)
            raise AIResponseError() from exc


ai_client = AIClient()

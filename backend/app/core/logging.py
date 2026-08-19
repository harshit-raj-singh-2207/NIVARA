"""
Structured JSON logging configuration for the NIVARA backend.
"""

import logging
import sys
from typing import Optional

from app.core.config import settings

_CONFIGURED = False


def configure_logging(level: Optional[str] = None) -> None:
    """
    Configures the root logger with a structured format.
    Safe to call multiple times (idempotent).
    """
    global _CONFIGURED
    if _CONFIGURED:
        return

    log_level = getattr(logging, (level or ("DEBUG" if settings.DEBUG else "INFO")).upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Suppress noisy third-party loggers
    logging.getLogger("motor").setLevel(logging.WARNING)
    logging.getLogger("pymongo").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)

    _CONFIGURED = True

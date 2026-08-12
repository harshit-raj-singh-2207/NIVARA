"""
Structured JSON Logger Infrastructure for NIVARA backend.
Provides async-friendly structured JSON logging using Python standard logging / structlog.
Formats request IDs, user IDs, timestamps, and exception stack traces.
"""

import json
import logging
import sys
from datetime import datetime
from typing import Any, Dict, Optional


class JSONFormatter(logging.Formatter):
    """
    Custom JSON Formatter for structured log serialization.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_object: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "line": record.lineno,
        }

        # Contextual metadata parameters passed in extra dict
        if hasattr(record, "request_id"):
            log_object["request_id"] = record.request_id
        if hasattr(record, "user_id"):
            log_object["user_id"] = record.user_id
        if hasattr(record, "path"):
            log_object["path"] = record.path

        # Exception stack trace formatting
        if record.exc_info:
            log_object["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_object)


def setup_logger(name: str = "nivara", level: int = logging.INFO) -> logging.Logger:
    """
    Configures and returns a structured JSON logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        logger.propagate = False

    return logger


# Default application logger singleton
logger = setup_logger()


def get_logger(module_name: Optional[str] = None) -> logging.Logger:
    """
    Returns a child or named logger instance.
    """
    if module_name:
        return logging.getLogger(f"nivara.{module_name}")
    return logger

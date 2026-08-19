"""
Infrastructure logger — structured JSON logger for infrastructure components.
Re-uses the core logging configuration.
"""

import logging
from app.core.logging import configure_logging

configure_logging()
logger = logging.getLogger("nivara.infrastructure")

"""
Standardised API response builder utilities.
"""

from typing import Any, Dict, List, Optional


def success_response(
    data: Any = None,
    message: str = "Success",
    meta: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Returns a standardised success response dict."""
    resp: Dict[str, Any] = {"success": True, "message": message}
    if data is not None:
        resp["data"] = data
    if meta:
        resp["meta"] = meta
    return resp


def error_response(
    message: str,
    code: str = "ERROR",
    details: Optional[Any] = None,
) -> Dict[str, Any]:
    """Returns a standardised error response dict."""
    resp: Dict[str, Any] = {"success": False, "error": code, "message": message}
    if details is not None:
        resp["details"] = details
    return resp


def list_response(
    items: List[Any],
    total: int,
    page: int = 1,
    page_size: int = 20,
) -> Dict[str, Any]:
    """Returns a standardised paginated list response dict."""
    import math
    total_pages = math.ceil(total / page_size) if page_size else 0
    return {
        "success": True,
        "items": items,
        "pagination": {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        },
    }

"""
Dashboard Pydantic schemas for the caregivers domain.
Provides the caregiver dashboard summary and dependent safety snapshot views.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class DependentSafetySnapshot(BaseModel):
    """
    Real-time safety snapshot for a single dependent.
    Displayed as a card on the caregiver dashboard.
    """

    dependent_id: str
    dependent_name: str
    profile_picture_url: Optional[str] = None

    # Location
    last_latitude: Optional[float] = None
    last_longitude: Optional[float] = None
    is_inside_safe_zone: bool = True
    active_zone_name: Optional[str] = None
    last_location_update: Optional[str] = None

    # Band
    band_paired: bool = False
    band_battery_level: Optional[int] = None
    band_rssi: Optional[int] = None
    band_is_separated: bool = False
    band_signal_quality: Optional[str] = None

    # Device
    device_battery_level: Optional[int] = None

    # Active alerts
    active_emergency_count: int = 0
    last_emergency_at: Optional[str] = None

    # Status labels
    safety_status: str = "safe"  # "safe", "warning", "danger"
    status_reason: Optional[str] = None


class ActiveAlertSummary(BaseModel):
    """Brief summary of an active emergency or safety event."""

    event_id: str
    event_type: str
    title: str
    message: str
    dependent_id: str
    dependent_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: str
    status: str


class CaregiverDashboardResponse(BaseModel):
    """
    Full caregiver dashboard response.
    Aggregates safety snapshots for all linked dependents
    and a summary of active alerts.
    """

    caregiver_id: str
    caregiver_name: str
    total_dependents: int
    dependents_inside_zone: int
    dependents_outside_zone: int
    active_emergencies: int
    dependent_snapshots: List[DependentSafetySnapshot]
    active_alerts: List[ActiveAlertSummary]
    generated_at: str


class SafetyOverviewResponse(BaseModel):
    """
    High-level safety overview for a caregiver — lightweight version of dashboard.
    """

    total_dependents: int
    safe_count: int
    warning_count: int
    danger_count: int
    active_emergency_count: int
    all_safe: bool
    last_updated: str

/**
 * Safety domain type definitions (JSDoc).
 * These serve as documentation and enable IDE autocompletion
 * without requiring TypeScript.
 */

// ── Enums ───────────────────────────────────────────────

/** @enum {string} */
export const EmergencyStatus = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled',
};

/** @enum {string} */
export const EmergencyType = {
  SOS: 'sos',
  BAND_SOS: 'band_sos',
  GEOFENCE_EXIT: 'geofence_exit',
  SEPARATION: 'separation',
};

/** @enum {string} */
export const SafetyEventType = {
  SOS_TRIGGERED: 'sos_triggered',
  SOS_RESOLVED: 'sos_resolved',
  SOS_CANCELLED: 'sos_cancelled',
  GEOFENCE_ENTER: 'geofence_enter',
  GEOFENCE_EXIT: 'geofence_exit',
  BAND_CONNECTED: 'band_connected',
  BAND_DISCONNECTED: 'band_disconnected',
  SEPARATION_DETECTED: 'separation_detected',
  SEPARATION_RESOLVED: 'separation_resolved',
  BAND_SOS: 'band_sos',
  BAND_LOW_BATTERY: 'band_low_battery',
};

/** @enum {string} */
export const SafetyEventSeverity = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
};

/** @enum {string} */
export const BandConnectionStatus = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  SCANNING: 'scanning',
  PAIRING: 'pairing',
};

/** @enum {string} */
export const LocationSource = {
  PHONE: 'phone',
  BAND: 'band',
  MANUAL: 'manual',
};

// ── Shape Definitions ───────────────────────────────────

/**
 * @typedef {Object} LocationCoords
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} [accuracy]     - Meters
 * @property {number} [altitude]
 * @property {number} [heading]
 * @property {number} [speed]        - m/s
 */

/**
 * @typedef {Object} LocationRecord
 * @property {string} id
 * @property {string} userId
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} accuracy
 * @property {string} source         - LocationSource
 * @property {string} timestamp      - ISO string
 * @property {string} [address]      - Reverse-geocoded address
 */

/**
 * @typedef {Object} SafeZone
 * @property {string} id
 * @property {string} userId
 * @property {string} name           - e.g. "Home", "School"
 * @property {number} latitude       - Center point
 * @property {number} longitude      - Center point
 * @property {number} radius         - Meters
 * @property {string} [address]
 * @property {string} [notes]
 * @property {boolean} active
 * @property {string} createdAt      - ISO string
 * @property {string} updatedAt      - ISO string
 */

/**
 * @typedef {Object} EmergencyEvent
 * @property {string} id
 * @property {string} userId
 * @property {string} type           - EmergencyType
 * @property {string} status         - EmergencyStatus
 * @property {LocationCoords} location
 * @property {string} [address]
 * @property {string[]} contactsNotified - Array of contact IDs
 * @property {string} triggeredAt    - ISO string
 * @property {string} [resolvedAt]   - ISO string
 * @property {string} [resolvedBy]   - User ID who resolved
 * @property {string} [notes]
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} id
 * @property {string} userId
 * @property {string} name
 * @property {string} phone
 * @property {string} [email]
 * @property {string} relationship   - e.g. "Mother", "Father", "Therapist"
 * @property {number} priority       - 1 = highest
 * @property {boolean} notifyOnSOS
 * @property {boolean} notifyOnGeofence
 */

/**
 * @typedef {Object} GPSBand
 * @property {string} id
 * @property {string} userId
 * @property {string} deviceId       - BLE device identifier
 * @property {string} name           - User-given name
 * @property {string} connectionStatus - BandConnectionStatus
 * @property {number} [batteryLevel] - 0–100
 * @property {LocationCoords} [lastLocation]
 * @property {string} [lastSeen]     - ISO string
 * @property {string} pairedAt       - ISO string
 */

/**
 * @typedef {Object} SafetyEvent
 * @property {string} id
 * @property {string} userId
 * @property {string} type           - SafetyEventType
 * @property {string} severity       - SafetyEventSeverity
 * @property {string} title          - Human-readable title
 * @property {string} description    - Detail text
 * @property {LocationCoords} [location]
 * @property {Object} [data]         - Extra event-specific payload
 * @property {string} timestamp      - ISO string
 * @property {boolean} acknowledged
 */

/**
 * @typedef {Object} SafetyStatus
 * @property {boolean} isSafe
 * @property {boolean} isEmergencyActive
 * @property {boolean} isBandConnected
 * @property {boolean} isInsideSafeZone
 * @property {string} [currentZoneName]
 * @property {string} lastUpdated    - ISO string
 */

// ── Event Icon / Color Mapping ──────────────────────────

export const SAFETY_EVENT_META = {
  [SafetyEventType.SOS_TRIGGERED]: {
    icon: '🆘',
    label: 'SOS Triggered',
    severity: SafetyEventSeverity.CRITICAL,
  },
  [SafetyEventType.SOS_RESOLVED]: {
    icon: '✅',
    label: 'SOS Resolved',
    severity: SafetyEventSeverity.INFO,
  },
  [SafetyEventType.SOS_CANCELLED]: {
    icon: '❌',
    label: 'SOS Cancelled',
    severity: SafetyEventSeverity.INFO,
  },
  [SafetyEventType.GEOFENCE_ENTER]: {
    icon: '📍',
    label: 'Entered Safe Zone',
    severity: SafetyEventSeverity.INFO,
  },
  [SafetyEventType.GEOFENCE_EXIT]: {
    icon: '⚠️',
    label: 'Left Safe Zone',
    severity: SafetyEventSeverity.WARNING,
  },
  [SafetyEventType.BAND_CONNECTED]: {
    icon: '⌚',
    label: 'Band Connected',
    severity: SafetyEventSeverity.INFO,
  },
  [SafetyEventType.BAND_DISCONNECTED]: {
    icon: '🔴',
    label: 'Band Disconnected',
    severity: SafetyEventSeverity.WARNING,
  },
  [SafetyEventType.SEPARATION_DETECTED]: {
    icon: '🚨',
    label: 'Separation Detected',
    severity: SafetyEventSeverity.CRITICAL,
  },
  [SafetyEventType.SEPARATION_RESOLVED]: {
    icon: '🔗',
    label: 'Separation Resolved',
    severity: SafetyEventSeverity.INFO,
  },
  [SafetyEventType.BAND_SOS]: {
    icon: '⌚🆘',
    label: 'Band SOS Pressed',
    severity: SafetyEventSeverity.CRITICAL,
  },
  [SafetyEventType.BAND_LOW_BATTERY]: {
    icon: '🪫',
    label: 'Band Low Battery',
    severity: SafetyEventSeverity.WARNING,
  },
};

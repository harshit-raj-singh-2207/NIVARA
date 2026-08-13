/**
 * Caregiver domain type definitions (JSDoc).
 * These serve as documentation and enable IDE autocompletion.
 */

// ── Enums ───────────────────────────────────────────────

/** @enum {string} */
export const CaregiverRole = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  THERAPIST: 'therapist',
  EDUCATOR: 'educator',
};

/** @enum {string} */
export const DeviceType = {
  SMARTPHONE: 'smartphone',
  GPS_BAND: 'gps_band',
  TABLET: 'tablet',
};

// ── Shape Definitions ───────────────────────────────────

/**
 * @typedef {Object} ChildProfile
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [avatarUrl]
 * @property {string} dateOfBirth        - ISO string (YYYY-MM-DD)
 * @property {string} [diagnosis]
 * @property {string} [notes]            - General medical/behavioral notes
 * @property {boolean} isActive          - Whether this child is actively monitored
 * @property {string} createdAt          - ISO string
 */

/**
 * @typedef {Object} DeviceInfo
 * @property {string} id
 * @property {string} userId             - The child this device belongs to
 * @property {string} type               - DeviceType
 * @property {string} name               - e.g. "Timmy's Phone", "Safety Band"
 * @property {string} [model]            - e.g. "iPhone 13", "Nivara Band v1"
 * @property {string} osVersion
 * @property {string} appVersion
 * @property {string} connectionStatus   - 'connected', 'disconnected'
 * @property {number} [batteryLevel]     - 0-100
 * @property {boolean} [batteryCharging]
 * @property {string} lastSeen           - ISO string
 */

/**
 * @typedef {Object} CaregiverPreference
 * @property {string} caregiverId
 * @property {string} targetChildId      - Preferences can be per-child
 * @property {boolean} notifyOnSOS
 * @property {boolean} notifyOnGeofence
 * @property {boolean} notifyOnSeparation
 * @property {boolean} notifyOnLowBattery
 * @property {boolean} notifyOnRoutineComplete
 * @property {boolean} shareLocationWithSecondary - Whether secondary caregivers can see location
 */

/**
 * @typedef {Object} CaregiverStatusSummary
 * @property {string} childId
 * @property {import('./safety').SafetyStatus} safety
 * @property {DeviceInfo[]} devices
 * @property {import('./safety').LocationRecord} [currentLocation]
 * @property {import('./safety').SafetyEvent[]} recentEvents - Last N events
 */

/**
 * @typedef {Object} CaregiverProfile
 * @property {string} id
 * @property {string} userId             - Base user account ID
 * @property {string} role               - CaregiverRole
 * @property {string[]} assignedChildren - Array of child IDs they can monitor
 * @property {boolean} isVerified        - Background check/verification status
 */

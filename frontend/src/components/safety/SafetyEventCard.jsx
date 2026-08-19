import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import { getEventMetadata } from '../../types/safety';
import { formatDateShort } from '../../utils/dateUtils';

/**
 * Renders a single row item in the Safety Event Timeline.
 * 
 * @param {Object} props
 * @param {import('../../types/safety').SafetyEvent} props.event - The raw event object from backend
 * @param {boolean} [props.isLast=false] - If true, hides the vertical connecting line below the icon
 */
const SafetyEventCard = ({ event, isLast = false }) => {
  // Use our type helper to get the UI metadata (icon, color, user-friendly label)
  const meta = getEventMetadata(event.type);
  
  const timeString = event.timestamp ? formatDateShort(event.timestamp) : 'Just now';

  // Construct a descriptive string if location metadata exists
  let detailsText = '';
  if (event.metadata?.zoneName) {
    detailsText = `${event.metadata.zoneName}`;
  } else if (event.metadata?.batteryLevel) {
    detailsText = `${event.metadata.batteryLevel}% remaining`;
  }

  return (
    <View style={styles.container}>
      
      {/* Left Column: Timeline Line & Icon */}
      <View style={styles.timelineColumn}>
        <View style={[styles.iconWrapper, { backgroundColor: meta.bgColor }]}>
          <Ionicons name={meta.icon} size={20} color={meta.color} />
        </View>
        {!isLast && <View style={styles.connectingLine} />}
      </View>

      {/* Right Column: Content Card */}
      <View style={styles.contentColumn}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title} numberOfLines={1}>{meta.label}</Text>
            <Text style={styles.timeText}>{timeString}</Text>
          </View>
          
          {detailsText ? (
            <Text style={styles.detailsText}>{detailsText}</Text>
          ) : null}
          
          {event.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={lightTheme.colors.text.secondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 80,
  },
  timelineColumn: {
    width: 50,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Keeps icon above the line
    borderWidth: 2,
    borderColor: lightTheme.colors.background,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    backgroundColor: lightTheme.colors.border,
    marginTop: -4,
    marginBottom: -4,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: lightTheme.spacing.lg,
  },
  card: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    ...lightTheme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...lightTheme.typography.body1,
    fontWeight: '700',
    color: lightTheme.colors.text.primary,
    flex: 1,
    marginRight: lightTheme.spacing.sm,
  },
  timeText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
  },
  detailsText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    marginLeft: 4,
  },
});

export default SafetyEventCard;

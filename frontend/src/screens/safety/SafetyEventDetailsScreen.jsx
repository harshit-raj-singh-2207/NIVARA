import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppMapView from '../../components/safety/MapView';
import Badge from '../../components/common/Badge';
import Divider from '../../components/common/Divider';
import { getEventMetadata } from '../../types/safety';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { lightTheme } from '../../theme';

/**
 * Safety Event Details Screen.
 * Full detail view of a single safety event (geofence exit, SOS, battery alert, etc.)
 * Navigated to from a timeline item or notification tap.
 *
 * @param {Object} props
 * @param {Object} props.route - React Navigation route object
 * @param {import('../../types/safety').SafetyEvent} props.route.params.event
 */
const SafetyEventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params || {};

  // Graceful guard if navigated to without an event in params
  if (!event) {
    return (
      <SafeAreaWrapper>
        <AppHeader title="Event Details" showBack />
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={lightTheme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No event data found.</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  const meta = getEventMetadata(event.type);

  // Map badge variant from event severity
  const badgeStatus = useMemo(() => {
    if (meta.color === lightTheme.colors.status.emergency) return 'emergency';
    if (meta.color === lightTheme.colors.status.warning) return 'warning';
    return 'safe';
  }, [meta]);

  const hasLocation = event.location?.latitude && event.location?.longitude;

  // Build a detail row list from the event's metadata fields
  const details = useMemo(() => {
    const rows = [
      { icon: 'calendar-outline', label: 'Date', value: formatDate(event.timestamp) },
      { icon: 'time-outline', label: 'Time', value: formatTime(event.timestamp) },
    ];

    if (event.metadata?.zoneName) {
      rows.push({ icon: 'location-outline', label: 'Zone', value: event.metadata.zoneName });
    }
    if (event.metadata?.batteryLevel != null) {
      rows.push({ icon: 'battery-half-outline', label: 'Battery at Event', value: `${event.metadata.batteryLevel}%` });
    }
    if (event.metadata?.deviceId) {
      rows.push({ icon: 'watch-outline', label: 'Device', value: event.metadata.deviceId });
    }

    return rows;
  }, [event]);

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader title="Event Details" showBack />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Icon & Title ─────────────────────────────── */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIconWrapper, { backgroundColor: meta.bgColor }]}>
            <Ionicons name={meta.icon} size={44} color={meta.color} />
          </View>
          <Text style={styles.heroTitle}>{meta.label}</Text>
          <Badge label={badgeStatus} status={badgeStatus} style={styles.heroBadge} />
        </View>

        {/* ── Event Map (If Location Available) ────────────── */}
        {hasLocation && (
          <>
            <Text style={styles.sectionLabel}>Event Location</Text>
            <AppMapView 
              location={event.location}
              height={220}
              scrollEnabled={false}
              zoomEnabled={false}
              style={styles.mapStyle}
            />
            <Text style={styles.coordText}>
              {event.location.latitude.toFixed(6)}, {event.location.longitude.toFixed(6)}
            </Text>
          </>
        )}

        {/* ── Event Details Table ──────────────────────────── */}
        <Text style={styles.sectionLabel}>Details</Text>
        <AppCard style={styles.detailCard} noPadding>
          {details.map((row, index) => (
            <React.Fragment key={row.label}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons 
                    name={row.icon} 
                    size={18} 
                    color={lightTheme.colors.text.secondary} 
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailLabel}>{row.label}</Text>
                </View>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
              {index < details.length - 1 && (
                <Divider 
                  color={lightTheme.colors.border}
                  marginVertical={0}
                  marginHorizontal={lightTheme.spacing.md}
                />
              )}
            </React.Fragment>
          ))}
        </AppCard>

        {/* ── Notes / Description ──────────────────────────── */}
        {event.metadata?.notes && (
          <>
            <Text style={styles.sectionLabel}>Notes</Text>
            <AppCard>
              <Text style={styles.notesText}>{event.metadata.notes}</Text>
            </AppCard>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    marginTop: lightTheme.spacing.md,
  },
  scrollContent: {
    padding: lightTheme.spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: lightTheme.spacing.xl,
  },
  heroIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  heroTitle: {
    ...lightTheme.typography.h2,
    color: lightTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  heroBadge: {
    marginTop: lightTheme.spacing.xs,
  },
  sectionLabel: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginTop: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.sm,
  },
  mapStyle: {
    borderRadius: lightTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  coordText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    textAlign: 'center',
    marginTop: lightTheme.spacing.xs,
    marginBottom: lightTheme.spacing.sm,
  },
  detailCard: {
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing.md,
    paddingHorizontal: lightTheme.spacing.md,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: lightTheme.spacing.sm,
  },
  detailLabel: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
  },
  detailValue: {
    ...lightTheme.typography.body2,
    fontWeight: '600',
    color: lightTheme.colors.text.primary,
    maxWidth: '55%',
    textAlign: 'right',
  },
  notesText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.primary,
    lineHeight: 24,
  },
});

export default SafetyEventDetailsScreen;

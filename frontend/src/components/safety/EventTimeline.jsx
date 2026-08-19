import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafetyEventCard from './SafetyEventCard';
import { lightTheme } from '../../theme';

/**
 * Reusable vertical timeline for rendering safety events.
 *
 * @param {Object} props
 * @param {import('../../types/safety').SafetyEvent[]} props.events - Array of events
 * @param {boolean} [props.isLoading=false]
 * @param {Function} [props.onRefresh]
 */
const EventTimeline = ({ events = [], isLoading = false, onRefresh }) => {
  if (!events || events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={32} color={lightTheme.colors.text.tertiary} />
        <Text style={styles.emptyText}>No recent safety events to display.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshing={isLoading}
      onRefresh={onRefresh}
      contentContainerStyle={styles.timelineContainer}
      renderItem={({ item, index }) => (
        <SafetyEventCard 
          event={item} 
          isLast={index === events.length - 1} 
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    paddingVertical: lightTheme.spacing.md,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: lightTheme.spacing.xl,
    marginTop: lightTheme.spacing.xl,
  },
  emptyText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    marginTop: lightTheme.spacing.sm,
  },
});

export default EventTimeline;

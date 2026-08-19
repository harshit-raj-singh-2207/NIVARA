import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import SafeZoneCard from '../../components/safety/SafeZoneCard';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import AppButton from '../../components/common/AppButton';
import { useSafetyStore } from '../../store/safetyStore';
import { safetyApi } from '../../services/api/safetyApi';
import { geofenceService } from '../../services/location/geofenceService';
import { ROUTES } from '../../constants/routes';
import { lightTheme } from '../../theme';

/**
 * Screen to display and manage all of the user's Safe Zones.
 */
const SafeZonesScreen = ({ navigation }) => {
  const { safeZones, isLoading, addSafeZone, removeSafeZone, setLoading, setError } = useSafetyStore();
  
  // Local UI state for delete confirmation modal
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load safe zones if the store is empty on mount
  useEffect(() => {
    if (safeZones.length === 0) {
      loadZones();
    }
  }, []);

  // Re-sync geofences on OS whenever the list changes
  useEffect(() => {
    if (safeZones.length > 0) {
      geofenceService.startMonitoringZones(safeZones).catch(console.warn);
    }
  }, [safeZones]);

  const loadZones = useCallback(async () => {
    setLoading(true);
    try {
      const zones = await safetyApi.getSafeZones();
      useSafetyStore.setState({ safeZones: zones });
    } catch (err) {
      setError('Failed to load safe zones.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const handleDeleteRequest = useCallback((id) => {
    setPendingDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await safetyApi.deleteSafeZone(pendingDeleteId);
      removeSafeZone(pendingDeleteId);
    } catch (err) {
      setError('Failed to delete safe zone. Please try again.');
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, removeSafeZone, setError]);

  const handleAddZone = useCallback(() => {
    navigation.navigate(ROUTES.SAFETY.ADD_SAFE_ZONE);
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <SafeZoneCard 
      zone={item} 
      onDelete={handleDeleteRequest}
    />
  ), [handleDeleteRequest]);

  const keyExtractor = useCallback((item) => item.id, []);

  if (isLoading && safeZones.length === 0) {
    return (
      <SafeAreaWrapper>
        <AppHeader title="Safe Zones" showBack />
        <Loading message="Loading your safe zones..." />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader 
        title="Safe Zones" 
        showBack 
        rightIcon="add-circle-outline"
        onRightPress={handleAddZone}
      />

      <FlatList
        data={safeZones}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onRefresh={loadZones}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="location-outline"
            title="No Safe Zones Yet"
            message="Create a Safe Zone for home, school, or therapy. You'll be alerted if they leave any of them."
            buttonText="Add First Safe Zone"
            onButtonPress={handleAddZone}
          />
        }
        ListFooterComponent={
          safeZones.length > 0 ? (
            <View style={styles.footer}>
              <AppButton 
                title="Add New Safe Zone" 
                variant="outline"
                leftIcon="add"
                onPress={handleAddZone}
              />
            </View>
          ) : null
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={!!pendingDeleteId}
        title="Delete Safe Zone"
        message="Are you sure you want to remove this safe zone? Boundary alerts for this area will stop immediately."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
        isLoading={isDeleting}
        icon="trash-outline"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  listContent: {
    padding: lightTheme.spacing.md,
    flexGrow: 1,
  },
  footer: {
    marginTop: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.xl,
  },
});

export default SafeZonesScreen;

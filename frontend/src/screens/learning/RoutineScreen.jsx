/**
 * RoutineScreen.jsx
 * Production-grade Daily Routines & Step-by-Step Task Execution Screen for NIVARA.
 * Connects routine timelines, task step checklists, transition reminders, and progress tracking.
 */

import React, { useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { BRAND_COLORS, STATUS_COLORS } from '../../constants/colors';
import useLearningStore from '../../store/learningStore';
import { handleApiError } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

import RoutineTimeline from '../../components/learning/RoutineTimeline';
import TaskCard from '../../components/learning/TaskCard';
import TaskStep from '../../components/learning/TaskStep';
import ProgressBar from '../../components/learning/ProgressBar';
import ReminderCard from '../../components/learning/ReminderCard';
import { LEARNING_ROUTES } from '../../constants/routes';

export const RoutineScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const {
    routines,
    activeRoutineId,
    activeReminder,
    isLoading,
    fetchRoutines,
    setActiveRoutineId,
    dismissReminder,
    toggleStepCompletion,
  } = useLearningStore();

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleRefresh = () => {
    fetchRoutines();
  };

  // Find currently active routine object
  const activeRoutine =
    routines.find((r) => r.id === activeRoutineId) || routines[0];
  const activeTasks = activeRoutine?.tasks || [];

  // Calculate overall steps completed for active routine
  let totalSteps = 0;
  let completedSteps = 0;

  activeTasks.forEach((task) => {
    (task.steps || []).forEach((step) => {
      totalSteps += 1;
      if (step.completed) completedSteps += 1;
    });
  });

  const progressRatio = totalSteps > 0 ? completedSteps / totalSteps : 0;

  const handleToggleStep = async (taskId, stepId) => {
    try {
      await toggleStepCompletion(taskId, stepId);
    } catch (err) {
      handleApiError(err, 'Failed to update step');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Daily Routines & Schedules"
        subtitle="Step-by-Step Task Breakdown"
        showBack={true}
        onBackPress={() => (navigation ? navigation.goBack() : null)}
      />

      {isLoading && <Loading overlay={true} size="large" message="Loading daily routines..." />}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* 1. TRANSITION REMINDER BANNER */}
        {activeReminder && (
          <ReminderCard
            reminder={activeReminder}
            onDismiss={dismissReminder}
          />
        )}

        {/* 2. DAILY ROUTINE TIMELINE */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
              marginBottom: spacing.xs,
            },
          ]}
        >
          🌅 Scheduled Daily Routines
        </Text>

        <RoutineTimeline
          routines={routines}
          activeRoutineId={activeRoutineId}
          onSelectRoutine={(id) => setActiveRoutineId(id)}
        />

        {/* 3. ACTIVE ROUTINE PROGRESS TRACKING BAR */}
        {activeRoutine && (
          <AppCard variant="elevated" style={[shadows.small, { marginTop: spacing.md, marginBottom: spacing.md }]}>
            <View style={styles.progressHeaderRow}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                }}
              >
                {activeRoutine.icon} {activeRoutine.title}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.sizes.xs,
                }}
              >
                {activeRoutine.time}
              </Text>
            </View>

            <ProgressBar
              progress={progressRatio}
              color={progressRatio === 1 ? colors.status.success : colors.primary}
              style={{ marginTop: spacing.xs }}
            />
            <AppButton title="Open routine details" variant="outline" size="small" onPress={() => navigation.navigate(LEARNING_ROUTES.ROUTINE_DETAILS, { routineId: activeRoutine.id })} style={{ marginTop: spacing.md }} />
          </AppCard>
        )}

        {/* 4. TASK BREAKDOWN CHECKLIST LIST */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
              marginTop: spacing.xs,
              marginBottom: spacing.xs,
            },
          ]}
        >
          📋 Routine Task Step Breakdown
        </Text>

        {activeTasks.length > 0 ? (
          activeTasks.map((taskItem) => (
            <TaskCard
              key={taskItem.id}
              task={taskItem}
              onToggleStep={handleToggleStep}
              onPress={() => navigation.navigate(LEARNING_ROUTES.TASK_DETAILS, { taskId: taskItem.id, routineId: activeRoutine.id })}
            />
          ))
        ) : (
          <EmptyState
            icon="📅"
            title="No Tasks Found"
            description="No scheduled tasks found for this routine period."
            actionTitle="Refresh Routines"
            onActionPress={handleRefresh}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    textAlign: 'left',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});

export default RoutineScreen;

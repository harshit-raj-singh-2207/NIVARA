/**
 * RoutineScreen.jsx
 * Production-grade Daily Routines & Step-by-Step Task Execution Screen for NIVARA.
 * Connects routine timelines, task step checklists, transition reminders, and progress tracking.
 */

import React, { useEffect, useState } from 'react';
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
import AppInput from '../../components/common/AppInput';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

import RoutineTimeline from '../../components/learning/RoutineTimeline';
import TaskCard from '../../components/learning/TaskCard';
import TaskStep from '../../components/learning/TaskStep';
import ProgressBar from '../../components/learning/ProgressBar';
import ReminderCard from '../../components/learning/ReminderCard';
import { LEARNING_ROUTES } from '../../constants/routes';
import learningApi from '../../services/api/learningApi';

export const RoutineScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineTime, setRoutineTime] = useState('Morning');
  const [taskTitle, setTaskTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

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
    fetchRoutines().catch(() => {});
  }, []);

  const handleRefresh = () => {
    fetchRoutines().catch(() => {});
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

  const handleCreateRoutine = async () => {
    const cleanRoutine = routineTitle.trim();
    const cleanTask = taskTitle.trim();
    if (cleanRoutine.length < 2 || cleanTask.length < 2) {
      setCreateError('Enter both a routine name and its first task.');
      return;
    }

    setCreating(true);
    setCreateError('');
    try {
      let steps;
      try {
        const breakdown = await learningApi.breakDownTask(cleanTask, 'simple');
        steps = breakdown.generated_steps || [];
      } catch (aiError) {
        const stamp = Date.now();
        steps = [
          { id: `step_${stamp}_1`, title: `Prepare for ${cleanTask}`, description: 'Collect what you need and get ready.', completed: false },
          { id: `step_${stamp}_2`, title: `Complete ${cleanTask}`, description: 'Work through the task one part at a time.', completed: false },
          { id: `step_${stamp}_3`, title: 'Check and finish', description: 'Make sure the task is complete.', completed: false },
        ];
      }

      const stamp = Date.now();
      const created = await learningApi.createRoutine({
        title: cleanRoutine,
        time: routineTime.trim() || 'Any time',
        icon: '📅',
        tasks: [{ id: `task_${stamp}`, title: cleanTask, icon: '✅', time: routineTime.trim() || 'Scheduled', steps }],
      });
      await fetchRoutines();
      setActiveRoutineId(created.id);
      setRoutineTitle('');
      setTaskTitle('');
    } catch (err) {
      setCreateError(err.message || 'Could not create the routine.');
    } finally {
      setCreating(false);
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

        <AppCard variant="bordered" style={{ marginBottom: spacing.lg }}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, marginBottom: spacing.sm }]}>Add a daily routine</Text>
          <AppInput
            label="Routine name"
            placeholder="Example: Morning routine"
            value={routineTitle}
            onChangeText={setRoutineTitle}
            autoCapitalize="sentences"
            maxLength={120}
          />
          <AppInput
            label="Time or period"
            placeholder="Example: 8:00 AM or Morning"
            value={routineTime}
            onChangeText={setRoutineTime}
            autoCapitalize="sentences"
            maxLength={80}
          />
          <AppInput
            label="First task"
            placeholder="Example: Brush my teeth"
            value={taskTitle}
            onChangeText={setTaskTitle}
            autoCapitalize="sentences"
            maxLength={200}
          />
          {createError ? <Text accessibilityRole="alert" style={{ color: colors.status.error, marginBottom: spacing.sm }}>{createError}</Text> : null}
          <AppButton title="Create Routine & Steps" loading={creating} disabled={creating} onPress={handleCreateRoutine} />
        </AppCard>

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
            actionTitle={activeRoutine ? 'Refresh Routines' : undefined}
            onActionPress={activeRoutine ? handleRefresh : undefined}
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

/**
 * Custom React Hook: useLearning
 * Connects UI components to useLearningStore for daily routine tasks, step completion progress, and transition reminders.
 */

import { useEffect, useCallback } from 'react';
import useLearningStore from '../store/learningStore';

export const useLearning = () => {
  const {
    routines,
    activeRoutineId,
    progressPercentage,
    activeReminder,
    isLoading,
    error,
    setActiveRoutineId,
    dismissReminder,
    fetchRoutines,
    toggleStepCompletion,
  } = useLearningStore();

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const activeRoutine = routines.find((r) => r.id === activeRoutineId) || routines[0];

  const handleToggleStep = useCallback(
    async (taskId, stepId) => {
      await toggleStepCompletion(taskId, stepId);
    },
    [toggleStepCompletion]
  );

  return {
    routines,
    activeRoutine,
    activeRoutineId,
    progressPercentage,
    activeReminder,
    isLoading,
    error,
    setActiveRoutineId,
    dismissReminder,
    refreshRoutines: fetchRoutines,
    toggleStepCompletion: handleToggleStep,
  };
};

export default useLearning;

/**
 * Learning & Routine Zustand Store for NIVARA frontend.
 * Manages daily scheduled routines, task progress percentages, step completion state, and active transition reminders.
 */

import { create } from 'zustand';
import learningApi from '../services/api/learningApi';

export const useLearningStore = create((set, get) => ({
  routines: [],
  activeRoutineId: 'routine_morning',
  progressPercentage: 0,
  activeReminder: {
    title: 'Transitioning to Morning Hygiene',
    time: 'In 10 Mins (8:15 AM)',
    icon: '⏰',
    description: 'Wrap up breakfast and prepare to move to the morning hygiene step.',
  },
  isLoading: false,
  error: null,

  setActiveRoutineId: (routineId) => set({ activeRoutineId: routineId }),
  dismissReminder: () => set({ activeReminder: null }),

  /**
   * Recalculates total completion percentage across all routine tasks.
   */
  calculateTaskProgress: (routinesList) => {
    let totalSteps = 0;
    let completedSteps = 0;

    routinesList.forEach((routine) => {
      routine.tasks.forEach((task) => {
        task.steps.forEach((step) => {
          totalSteps++;
          if (step.completed) completedSteps++;
        });
      });
    });

    return totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);
  },

  fetchRoutines: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await learningApi.getRoutines();
      const progress = get().calculateTaskProgress(data);
      set({ routines: data, progressPercentage: progress, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  toggleStepCompletion: async (taskId, stepId) => {
    const { routines } = get();

    const updatedRoutines = routines.map((routine) => ({
      ...routine,
      tasks: routine.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          steps: task.steps.map((step) => {
            if (step.id !== stepId) return step;
            const newCompleted = !step.completed;
            learningApi.updateStepCompletion(taskId, stepId, newCompleted);
            return { ...step, completed: newCompleted };
          }),
        };
      }),
    }));

    const progress = get().calculateTaskProgress(updatedRoutines);
    set({ routines: updatedRoutines, progressPercentage: progress });
  },
}));

export default useLearningStore;

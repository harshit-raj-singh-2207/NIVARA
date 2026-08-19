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
  requestInFlight: false,

  setActiveRoutineId: (routineId) => set({ activeRoutineId: routineId }),
  dismissReminder: () => set({ activeReminder: null }),

  /**
   * Recalculates total completion percentage across all routine tasks.
   */
  calculateTaskProgress: (routinesList) => {
    let totalSteps = 0;
    let completedSteps = 0;

    routinesList.forEach((routine) => {
      (routine.tasks || []).forEach((task) => {
        (task.steps || []).forEach((step) => {
          totalSteps++;
          if (step.completed) completedSteps++;
        });
      });
    });

    return totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);
  },

  fetchRoutines: async () => {
    if (get().requestInFlight) return get().routines;
    set({ isLoading: true, requestInFlight: true, error: null });
    try {
      const home = await learningApi.getHome();
      const data = home.routines;
      const progress = get().calculateTaskProgress(data);
      set({ routines: data, progressPercentage: progress, activeReminder: home.reminders[0] || null, isLoading: false, requestInFlight: false });
      return data;
    } catch (err) {
      set({ isLoading: false, requestInFlight: false, error: err.message, routines: [] });
      throw err;
    }
  },

  fetchRoutine: async (routineId) => {
    const routine = await learningApi.getRoutine(routineId);
    set((state) => ({ routines: [...state.routines.filter((item) => item.id !== routine.id), routine] }));
    return routine;
  },

  fetchTask: async (taskId) => learningApi.getTask(taskId),

  toggleStepCompletion: async (taskId, stepId) => {
    const { routines } = get();
    const task = routines.flatMap((routine) => routine.tasks || []).find((item) => item.id === taskId);
    const step = task?.steps?.find((item) => item.id === stepId);
    if (!step) throw new Error('Task step could not be found.');
    const newCompleted = !step.completed;

    const updatedRoutines = routines.map((routine) => ({
      ...routine,
      tasks: routine.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          steps: task.steps.map((step) => {
            if (step.id !== stepId) return step;
            return { ...step, completed: newCompleted };
          }),
        };
      }),
    }));

    const progress = get().calculateTaskProgress(updatedRoutines);
    set({ routines: updatedRoutines, progressPercentage: progress, error: null });
    try {
      await learningApi.updateStepCompletion(taskId, stepId, newCompleted);
    } catch (err) {
      set({ routines, progressPercentage: get().calculateTaskProgress(routines), error: err.message });
      throw err;
    }
  },
}));

export default useLearningStore;

/** Real Part 1 Learning API with one stable frontend data shape. */
import apiClient from './apiClient';
import { AI_API_TIMEOUT } from '../../constants/api';

const normalizeStep = (step = {}) => ({
  id: step.id,
  title: step.title,
  description: step.description || '',
  completed: Boolean(step.completed),
});

const normalizeTask = (task = {}) => ({
  id: task.id,
  title: task.title,
  icon: task.icon || '',
  time: task.time || '',
  description: task.description || '',
  steps: (task.steps || []).map(normalizeStep),
});

const normalizeRoutine = (routine = {}) => ({
  id: routine.id || routine._id,
  title: routine.title,
  time: routine.time || '',
  icon: routine.icon || '',
  tasks: (routine.tasks || []).map(normalizeTask),
  progressPercentage: routine.progress_percentage || 0,
});

const normalizeReminder = (item = {}) => ({
  id: item.id || item._id,
  title: item.title,
  description: item.description || '',
  scheduledAt: item.scheduled_at,
  time: item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : '',
  status: item.status || 'upcoming',
  routineId: item.routine_id || null,
  taskId: item.task_id || null,
});

export const learningApi = {
  getHome: async () => {
    const data = await apiClient.get('/learning/home');
    return {
      routines: (data.routines || []).map(normalizeRoutine),
      progress: data.progress || { total_steps: 0, completed_steps: 0, percentage: 0 },
      reminders: (data.reminders || []).map(normalizeReminder),
    };
  },
  getRoutines: async () => (await apiClient.get('/learning/routines')).map(normalizeRoutine),
  getRoutine: async (routineId) => normalizeRoutine(await apiClient.get(`/learning/routines/${routineId}`)),
  createRoutine: async (payload) => normalizeRoutine(await apiClient.post('/learning/routines', payload)),
  updateRoutine: async (routineId, payload) => normalizeRoutine(await apiClient.patch(`/learning/routines/${routineId}`, payload)),
  getTask: async (taskId) => normalizeTask(await apiClient.get(`/learning/tasks/${taskId}`)),
  updateTask: async (taskId, payload) => normalizeTask(await apiClient.patch(`/learning/tasks/${taskId}`, payload)),
  updateStepCompletion: (taskId, stepId, completed) =>
    apiClient.patch(`/learning/tasks/${taskId}/steps/${stepId}`, { completed }),
  breakDownTask: (taskTitle, complexityLevel = 'medium') =>
    apiClient.post('/learning/tasks/breakdown', { task_title: taskTitle, complexity_level: complexityLevel }, { timeout: AI_API_TIMEOUT }),
  getTopics: async () => {
    const data = await apiClient.get('/learning/topics');
    return data.map((item) => ({ id: item.id || item._id, slug: item.slug, title: item.title, category: item.category, description: item.description || '', difficulty: item.difficulty || 'beginner', source: item.source || 'default' }));
  },
  getProgress: () => apiClient.get('/learning/progress'),
  getReminders: async () => (await apiClient.get('/learning/reminders')).map(normalizeReminder),
  createReminder: async (payload) => normalizeReminder(await apiClient.post('/learning/reminders', payload)),
  askTutor: (concept, mode = 'simple') =>
    apiClient.post('/learning/tutor', { concept: concept.trim(), target_age_group: mode }, { timeout: AI_API_TIMEOUT }),
  getTutorHistory: () => apiClient.get('/learning/tutor/history'),
};

export { normalizeReminder, normalizeRoutine, normalizeStep, normalizeTask };
export default learningApi;

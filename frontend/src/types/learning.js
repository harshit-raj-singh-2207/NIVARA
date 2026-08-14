/**
 * Learning and Routine Data Types
 */

export const ROUTINE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
};

export const createRoutineItem = (data = {}) => ({
  id: data.id || `rtn_${Date.now()}`,
  title: data.title || '',
  time: data.time || '09:00 AM',
  status: data.status || ROUTINE_STATUS.PENDING,
  steps: data.steps || [],
  category: data.category || 'Daily Routine',
  icon: data.icon || 'calendar-outline',
});

export const createTaskStep = (data = {}) => ({
  id: data.id || `stp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  title: data.title || '',
  completed: data.completed || false,
  image: data.image || null,
});

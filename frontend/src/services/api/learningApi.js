/**
 * Learning & Routine API Service for NIVARA backend.
 */

import apiClient from './apiClient';

export const learningApi = {
  getRoutines: async () => {
    try {
      return await apiClient.get('/api/v1/learning/routines');
    } catch (err) {
      // Mock fallback data for routines
      return [
        {
          id: 'routine_morning',
          title: 'Morning Routine',
          time: '8:00 AM - 9:30 AM',
          icon: '🌅',
          tasks: [
            {
              id: 'task_m1',
              title: 'Morning Hygiene & Bathing',
              icon: '🪥',
              time: '8:15 AM',
              steps: [
                { id: 'step_m1_1', title: 'Brush Teeth for 2 mins', completed: true },
                { id: 'step_m1_2', title: 'Wash Face & Towel Dry', completed: true },
                { id: 'step_m1_3', title: 'Comb Hair', completed: false },
              ],
            },
            {
              id: 'task_m2',
              title: 'Healthy Breakfast',
              icon: '🍳',
              time: '8:45 AM',
              steps: [
                { id: 'step_m2_1', title: 'Eat Oatmeal & Fruit', completed: false },
                { id: 'step_m2_2', title: 'Drink Water Glass', completed: false },
              ],
            },
          ],
        },
        {
          id: 'routine_afternoon',
          title: 'Afternoon Study & Space',
          time: '1:00 PM - 3:00 PM',
          icon: '☀️',
          tasks: [
            {
              id: 'task_a1',
              title: 'Interactive Learning Topic',
              icon: '📚',
              time: '1:30 PM',
              steps: [
                { id: 'step_a1_1', title: 'Complete Topic 1 Lesson', completed: false },
                { id: 'step_a1_2', title: 'Take 5 min Low-Sensory Rest', completed: false },
              ],
            },
          ],
        },
        {
          id: 'routine_evening',
          title: 'Evening Relax & Sleep Prep',
          time: '8:00 PM - 9:30 PM',
          icon: '🌙',
          tasks: [
            {
              id: 'task_e1',
              title: 'Prepare Bedtime Environment',
              icon: '🌙',
              time: '8:30 PM',
              steps: [
                { id: 'step_e1_1', title: 'Dim Screen Brightness', completed: false },
                { id: 'step_e1_2', title: 'Put on Weighted Blanket', completed: false },
              ],
            },
          ],
        },
      ];
    }
  },

  updateStepCompletion: async (taskId, stepId, completed) => {
    try {
      return await apiClient.patch(`/api/v1/learning/tasks/${taskId}/steps/${stepId}`, {
        completed,
      });
    } catch (err) {
      return { success: true };
    }
  },
};

export default learningApi;

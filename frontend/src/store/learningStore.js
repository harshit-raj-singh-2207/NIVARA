import { create } from 'zustand';

export const useLearningStore = create((set, get) => ({
  routines: [
    {
      id: 'rtn_1',
      title: 'Morning Routine',
      time: '08:00 AM',
      category: 'Daily Routine',
      icon: 'sunny-outline',
      status: 'IN_PROGRESS',
      steps: [
        { id: 'st_1', title: 'Brush Teeth', completed: true },
        { id: 'st_2', title: 'Wash Face', completed: true },
        { id: 'st_3', title: 'Eat Healthy Breakfast', completed: false },
        { id: 'st_4', title: 'Pack School Bag', completed: false },
      ]
    },
    {
      id: 'rtn_2',
      title: 'Afternoon Study & Sensory Break',
      time: '02:30 PM',
      category: 'Learning',
      icon: 'book-outline',
      status: 'PENDING',
      steps: [
        { id: 'st_5', title: '15 Min Quiet Reading', completed: false },
        { id: 'st_6', title: 'Sensory Decompression', completed: false },
        { id: 'st_7', title: 'Math Worksheet', completed: false },
      ]
    },
    {
      id: 'rtn_3',
      title: 'Bedtime Wind-Down',
      time: '09:00 PM',
      category: 'Evening',
      icon: 'moon-outline',
      status: 'PENDING',
      steps: [
        { id: 'st_8', title: 'Dim Room Lights', completed: false },
        { id: 'st_9', title: 'Listen to Calming Story', completed: false },
      ]
    }
  ],
  learningTopics: [
    { id: 'lt_1', title: 'Social Cues & Gestures', count: '6 Lessons', progress: 0.6, icon: 'people-outline', color: '#6366F1' },
    { id: 'lt_2', title: 'Managing Overload', count: '4 Lessons', progress: 0.8, icon: 'shield-checkmark-outline', color: '#14B8A6' },
    { id: 'lt_3', title: 'Daily Life Skills', count: '8 Lessons', progress: 0.3, icon: 'construct-outline', color: '#F59E0B' },
  ],
  tutorMessages: [
    { id: 'tut_1', sender: 'TUTOR', text: "Hello Aarav! I am your AI Companion. How are you feeling today?", timestamp: '10:00 AM' },
  ],
  reminders: [
    { id: 'rem_1', title: 'Take Evening Vitamins', time: '07:00 PM', isEnabled: true },
    { id: 'rem_2', title: 'Sensory Noise Check', time: '01:00 PM', isEnabled: true },
  ],

  toggleStep: (routineId, stepId) => set(state => ({
    routines: state.routines.map(rtn => {
      if (rtn.id !== routineId) return rtn;
      const updatedSteps = rtn.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);
      const allDone = updatedSteps.every(s => s.completed);
      return {
        ...rtn,
        steps: updatedSteps,
        status: allDone ? 'COMPLETED' : 'IN_PROGRESS',
      };
    })
  })),

  addTutorMessage: (text, sender = 'USER') => set(state => {
    const newMsg = { id: `tut_${Date.now()}`, sender, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    return { tutorMessages: [...state.tutorMessages, newMsg] };
  }),

  sendTutorPrompt: async (userPrompt) => {
    get().addTutorMessage(userPrompt, 'USER');
    // Simulate AI Tutor response
    setTimeout(() => {
      let reply = "That's great! Taking deep breaths and using visual cues can help us stay calm and focused.";
      if (userPrompt.toLowerCase().includes('anxious') || userPrompt.toLowerCase().includes('loud')) {
        reply = "When things get loud, put on your noise-canceling headphones or take 3 slow, deep breaths.";
      }
      get().addTutorMessage(reply, 'TUTOR');
    }, 1000);
  }
}));

export default useLearningStore;

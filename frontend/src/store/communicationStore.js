import { create } from 'zustand';

export const useCommunicationStore = create((set, get) => ({
  activeCategory: 'NEEDS',
  selectedSentence: [],
  quickNeeds: [
    { id: 'qn_1', label: 'I need water', icon: 'water-outline', color: '#3B82F6', category: 'NEEDS' },
    { id: 'qn_2', label: 'I am hungry', icon: 'restaurant-outline', color: '#F59E0B', category: 'NEEDS' },
    { id: 'qn_3', label: 'Need quiet room', icon: 'volume-mute-outline', color: '#8B5CF6', category: 'NEEDS' },
    { id: 'qn_4', label: 'Bathroom please', icon: 'fitness-outline', color: '#10B981', category: 'NEEDS' },
    { id: 'qn_5', label: 'I feel overwhelmed', icon: 'warning-outline', color: '#EF4444', category: 'EMOTIONS' },
    { id: 'qn_6', label: 'Help me please', icon: 'hand-left-outline', color: '#EC4899', category: 'HELP' },
  ],
  aacCards: [
    { id: 'aac_1', label: 'Want', category: 'NEEDS', icon: 'hand-left-outline', color: '#6366F1' },
    { id: 'aac_2', label: 'Water', category: 'NEEDS', icon: 'water-outline', color: '#3B82F6' },
    { id: 'aac_3', label: 'Food', category: 'NEEDS', icon: 'restaurant-outline', color: '#F59E0B' },
    { id: 'aac_4', label: 'Rest', category: 'NEEDS', icon: 'bed-outline', color: '#8B5CF6' },
    { id: 'aac_5', label: 'Happy', category: 'EMOTIONS', icon: 'happy-outline', color: '#10B981' },
    { id: 'aac_6', label: 'Sad', category: 'EMOTIONS', icon: 'sad-outline', color: '#64748B' },
    { id: 'aac_7', label: 'Anxious', category: 'EMOTIONS', icon: 'pulse-outline', color: '#F59E0B' },
    { id: 'aac_8', label: 'Calm', category: 'EMOTIONS', icon: 'leaf-outline', color: '#14B8A6' },
    { id: 'aac_9', label: 'Play', category: 'ACTIVITIES', icon: 'game-controller-outline', color: '#EC4899' },
    { id: 'aac_10', label: 'Listen Music', category: 'ACTIVITIES', icon: 'musical-notes-outline', color: '#8B5CF6' },
    { id: 'aac_11', label: 'Mom', category: 'PEOPLE', icon: 'person-outline', color: '#F43F5E' },
    { id: 'aac_12', label: 'Teacher', category: 'PEOPLE', icon: 'school-outline', color: '#0EA5E9' },
  ],
  emotionHistory: [
    { id: 'em_1', emotion: 'Calm', intensity: 8, note: 'Listening to rain sound', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'em_2', emotion: 'Anxious', intensity: 6, note: 'Loud classroom noise', timestamp: new Date(Date.now() - 14400000).toISOString() },
  ],

  setActiveCategory: (category) => set({ activeCategory: category }),
  
  addToSentence: (item) => set((state) => ({
    selectedSentence: [...state.selectedSentence, item]
  })),

  removeFromSentence: (index) => set((state) => ({
    selectedSentence: state.selectedSentence.filter((_, i) => i !== index)
  })),

  clearSentence: () => set({ selectedSentence: [] }),

  logEmotion: (emotionData) => set((state) => ({
    emotionHistory: [{
      id: `em_${Date.now()}`,
      emotion: emotionData.emotion,
      intensity: emotionData.intensity || 5,
      note: emotionData.note || '',
      timestamp: new Date().toISOString(),
    }, ...state.emotionHistory]
  })),
}));

export default useCommunicationStore;

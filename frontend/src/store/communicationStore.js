/**
 * Communication Zustand Store for NIVARA frontend.
 * Manages active AAC boards, custom phrase lists, emotion states, sentence generation, and text simplification.
 */

import { create } from 'zustand';
import communicationApi from '../services/api/communicationApi';

const DEFAULT_AAC_BOARDS = [
  {
    id: 'board_basic_needs',
    title: 'Basic Needs & Feelings',
    icon: '💬',
    items: [
      { id: 'item_1', label: 'I Need Help', symbol: '🚨', category: 'urgent' },
      { id: 'item_2', label: 'Need Quiet Space', symbol: '🎧', category: 'sensory' },
      { id: 'item_3', label: 'Water / Drink', symbol: '🧃', category: 'basic' },
      { id: 'item_4', label: 'Hungry / Food', symbol: '🍎', category: 'basic' },
      { id: 'item_5', label: 'Yes', symbol: '✅', category: 'response' },
      { id: 'item_6', label: 'No', symbol: '❌', category: 'response' },
    ],
  },
  {
    id: 'board_emotions',
    title: 'Emotional State Expression',
    icon: '🎭',
    items: [
      { id: 'item_7', label: 'Feeling Calm', symbol: '😌', category: 'emotion' },
      { id: 'item_8', label: 'Feeling Overwhelmed', symbol: '😵‍💫', category: 'emotion' },
      { id: 'item_9', label: 'Feeling Happy', symbol: '😊', category: 'emotion' },
      { id: 'item_10', label: 'Feeling Tired', symbol: '🥱', category: 'emotion' },
    ],
  },
];

const DEFAULT_CUSTOM_PHRASES = [
  'I need a quiet moment right now.',
  'Could you please slow down and repeat that?',
  'I am using my AAC app to communicate today.',
  'Please wait while I assemble my sentence.',
];

export const useCommunicationStore = create((set, get) => ({
  aacBoards: DEFAULT_AAC_BOARDS,
  activeBoardId: 'board_basic_needs',
  customPhrases: DEFAULT_CUSTOM_PHRASES,
  activeEmotion: 'calm',
  selectedStyle: 'simple', // 'simple' | 'friendly' | 'formal'
  inputText: '',
  suggestions: [
    'I need a quiet moment right now.',
    'I would like to drink some water.',
    'Could you please slow down and repeat that?',
  ],
  isLoading: false,
  error: null,

  setActiveBoardId: (boardId) => set({ activeBoardId: boardId }),
  setActiveEmotion: (emotion) => set({ activeEmotion: emotion }),
  saveActiveEmotion: async (emotion) => {
    set({ activeEmotion: emotion, error: null });
    try {
      return await communicationApi.updateEmotion(emotion);
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setInputText: (text) => set({ inputText: text }),

  addCustomPhrase: (newPhrase) => {
    if (!newPhrase.trim()) return;
    const { customPhrases } = get();
    set({ customPhrases: [...customPhrases, newPhrase.trim()] });
  },

  removeCustomPhrase: (index) => {
    const { customPhrases } = get();
    const updated = customPhrases.filter((_, i) => i !== index);
    set({ customPhrases: updated });
  },

  generateAISentences: async (customPrompt = '') => {
    if (get().isLoading) return null;
    set({ isLoading: true, error: null });
    try {
      const { activeEmotion, selectedStyle, inputText } = get();
      const promptToUse = customPrompt || inputText;
      const res = await communicationApi.generateSentences(activeEmotion, promptToUse, selectedStyle);
      const newSuggestions = res.suggestions || res;
      set({ suggestions: newSuggestions, isLoading: false });
      return newSuggestions;
    } catch (err) {
      set({ isLoading: false, error: err.message, suggestions: [] });
      throw err;
    }
  },

  simplifyInputText: async () => {
    if (get().isLoading) return null;
    set({ isLoading: true, error: null });
    try {
      const { inputText, selectedStyle } = get();
      if (!inputText.trim()) {
        set({ isLoading: false });
        return;
      }
      const res = await communicationApi.simplifyText(inputText, selectedStyle);
      const text = res.simplified_text || res.text || res;
      set({ inputText: text, isLoading: false });
      return text;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  sendQuickNeedAlert: async (needTitle) => {
    const alertTypes = {
      'I Need Help': 'NEED_HELP',
      'I Need Space': 'NEED_SPACE',
      "I Can't Speak": 'CANT_SPEAK',
    };
    const type = alertTypes[needTitle];
    if (!type) throw new Error('This quick alert is not supported.');
    return communicationApi.createAlert(type, needTitle);
  },
}));

export default useCommunicationStore;

/** Real Part 1 Communication API with centralized response normalization. */
import apiClient from './apiClient';
import { AI_API_TIMEOUT } from '../../constants/api';

const normalizePhrase = (item = {}) => ({
  id: item.id,
  category: item.category,
  label: item.label,
  text: item.text,
  icon: item.icon || item.label?.slice(0, 1) || '',
  order: item.order || 0,
});

const normalizeHistoryItem = (item = {}) => ({
  id: item.id || item._id,
  type: item.type || 'MESSAGE',
  inputContent: item.input_content || '',
  outputContent: item.output_content || '',
  emotion: item.emotion || null,
  style: item.style || null,
  createdAt: item.created_at,
});

export const communicationApi = {
  generateSentences: (emotion, promptText, style = 'simple') =>
    apiClient.post('/communication/generate-sentence', {
      emotion,
      prompt: promptText.trim(),
      keywords: [],
      style,
    }, { timeout: AI_API_TIMEOUT }),

  simplifyText: (text, style = 'simple') =>
    apiClient.post('/communication/simplify', { text: text.trim(), style }, { timeout: AI_API_TIMEOUT }),

  explainMessage: (message) =>
    apiClient.post('/communication/explain', { message: message.trim() }, { timeout: AI_API_TIMEOUT }),

  generateEmotionMessage: (emotion, context = '', style = 'simple') =>
    apiClient.post('/communication/emotion', { emotion, context: context.trim(), style }, { timeout: AI_API_TIMEOUT }),

  getAACCategories: async () => {
    const data = await apiClient.get('/communication/aac/categories');
    return data.map((category) => ({
      id: category.id,
      label: category.label,
      order: category.order,
      phrases: (category.phrases || []).map(normalizePhrase),
    }));
  },

  getAACPhraseList: async (category) => {
    const params = category ? { category } : undefined;
    const data = await apiClient.get('/communication/aac/phrases', { params });
    return data.map(normalizePhrase);
  },

  generateAACSentence: async (phraseIds) => {
    const data = await apiClient.post('/communication/aac/generate', { phrase_ids: phraseIds });
    return { sentence: data.sentence, phrases: (data.phrases || []).map(normalizePhrase) };
  },

  getQuickPhrases: async () => {
    const data = await apiClient.get('/communication/quick');
    return (data.phrases || []).map(normalizePhrase);
  },

  createAlert: (type, message) =>
    apiClient.post('/communication/alerts', { type, message }),

  getAlerts: (params = { limit: 20, skip: 0 }) =>
    apiClient.get('/communication/alerts', { params }),

  updateAlert: (alertId, status) =>
    apiClient.patch(`/communication/alerts/${alertId}`, { status }),

  getEmotion: () => apiClient.get('/communication/emotion'),

  updateEmotion: (emotion) =>
    apiClient.post('/communication/emotion/state', { emotion }),

  getAACSymbols: async (category) => {
    const data = await apiClient.get('/communication/aac/symbols', { params: category ? { category } : undefined });
    return data.map(normalizePhrase);
  },

  recordAACSelection: (symbolId, generatedText = null) =>
    apiClient.post('/communication/aac/selection', { symbolId, generated_text: generatedText }),

  getPreferences: () => apiClient.get('/communication/preferences'),

  updatePreferences: (preferences) => apiClient.put('/communication/preferences', preferences),

  prepareSpeech: (message) => apiClient.post('/communication/speech', { message }),

  getHistory: async (params = { limit: 50, skip: 0 }) => {
    const data = await apiClient.get('/communication/history', { params });
    return { ...data, items: (data.items || []).map(normalizeHistoryItem) };
  },
};

export default communicationApi;

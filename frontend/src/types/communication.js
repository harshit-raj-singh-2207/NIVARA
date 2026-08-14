/**
 * AAC Communication Data Types
 */

export const AAC_CATEGORIES = {
  NEEDS: 'NEEDS',
  EMOTIONS: 'EMOTIONS',
  ACTIVITIES: 'ACTIVITIES',
  PEOPLE: 'PEOPLE',
  FOOD: 'FOOD',
  PLACES: 'PLACES',
  HELP: 'HELP',
};

export const createAACItem = (data = {}) => ({
  id: data.id || `aac_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  label: data.label || '',
  category: data.category || AAC_CATEGORIES.NEEDS,
  icon: data.icon || 'help-circle-outline',
  color: data.color || '#6366F1',
  audioText: data.audioText || data.label || '',
  symbolUrl: data.symbolUrl || null,
  isFavorite: data.isFavorite || false,
});

export const createEmotionLog = (data = {}) => ({
  id: data.id || `emo_${Date.now()}`,
  emotion: data.emotion || 'Calm',
  intensity: data.intensity || 5,
  note: data.note || '',
  timestamp: data.timestamp || new Date().toISOString(),
  trigger: data.trigger || 'Unknown',
});

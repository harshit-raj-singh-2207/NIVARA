/**
 * Message Utilities for NIVARA frontend.
 * Provides text sanitization, chat message formatting, and emotion tag parsing.
 */

/**
 * Sanitizes input string by trimming whitespace and removing hazardous characters.
 * @param {string} text
 * @returns {string} Sanitized string
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
};

/**
 * Truncates text with an ellipsis if it exceeds maximum length.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

/**
 * Parses emotion keywords from sentence text to assign visual tags or emojis.
 * @param {string} text
 * @returns {object} { emotion: string, emoji: string }
 */
export const extractEmotionTag = (text) => {
  if (!text) return { emotion: 'neutral', emoji: '💬' };
  const lower = text.toLowerCase();

  if (lower.includes('calm') || lower.includes('quiet') || lower.includes('peaceful')) {
    return { emotion: 'calm', emoji: '😌' };
  }
  if (lower.includes('overwhelmed') || lower.includes('loud') || lower.includes('noise') || lower.includes('space')) {
    return { emotion: 'overwhelmed', emoji: '🎧' };
  }
  if (lower.includes('happy') || lower.includes('good') || lower.includes('glad') || lower.includes('great')) {
    return { emotion: 'happy', emoji: '😊' };
  }
  if (lower.includes('help') || lower.includes('urgent') || lower.includes('sos') || lower.includes('need')) {
    return { emotion: 'urgent', emoji: '🚨' };
  }

  return { emotion: 'neutral', emoji: '💬' };
};

/**
 * Constructs a structured chat message payload.
 * @param {string} text
 * @param {string} senderId
 * @param {string} [chatId]
 * @returns {object} Message object
 */
export const createMessagePayload = (text, senderId, chatId = null) => {
  const clean = sanitizeText(text);
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    chatId,
    senderId,
    text: clean,
    content: clean,
    timestamp: new Date().toISOString(),
    status: 'sent',
  };
};

export default {
  sanitizeText,
  truncateText,
  extractEmotionTag,
  createMessagePayload,
};

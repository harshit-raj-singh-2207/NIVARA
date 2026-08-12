/**
 * Document Picker Service for NIVARA frontend.
 * Enables document selection (PDFs, docs, images, audio) for attachments in chat and community posts.
 */

let DocumentPicker = null;
try {
  DocumentPicker = require('expo-document-picker');
} catch (e) {
  // Graceful fallback if expo-document-picker is missing
}

/**
 * Selects a document file from local device storage.
 * @param {string|Array<string>} allowedTypes - MIME types array or string (e.g. '*/*', 'application/pdf', 'image/*')
 * @param {object} options - Custom options (copyToCacheDirectory, etc.)
 * @returns {Promise<object|null>} Object containing { uri, name, size, mimeType } or null
 */
export const pickDocument = async (allowedTypes = '*/*', options = {}) => {
  try {
    const typeOption = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

    if (DocumentPicker && DocumentPicker.getDocumentAsync) {
      const result = await DocumentPicker.getDocumentAsync({
        type: typeOption,
        copyToCacheDirectory: true,
        multiple: false,
        ...options,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.name || `file_${Date.now()}`,
          size: asset.size || 0,
          mimeType: asset.mimeType || 'application/octet-stream',
          type: asset.mimeType || 'application/octet-stream',
        };
      }
    }
    return null;
  } catch (err) {
    console.warn('Document picker error:', err);
    return null;
  }
};

export default {
  pickDocument,
};

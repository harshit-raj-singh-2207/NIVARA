/**
 * Image Picker Service for NIVARA frontend.
 * Manages photo capture via camera and selection from photo library using Expo ImagePicker.
 */

import { requestCameraPermission, requestMediaLibraryPermission } from '../../utils/permissionUtils';

let ImagePicker = null;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  // Graceful fallback if expo-image-picker is missing
}

const DEFAULT_OPTIONS = {
  mediaTypes: ImagePicker ? ImagePicker.MediaTypeOptions.Images : 'Images',
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
  base64: false,
};

/**
 * Captures an image using device camera.
 * @param {object} customOptions - Overriding options (allowsEditing, aspect, quality)
 * @returns {Promise<object|null>} Object with { uri, width, height, type, name } or null
 */
export const pickImageFromCamera = async (customOptions = {}) => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return null;

    const options = { ...DEFAULT_OPTIONS, ...customOptions };

    if (ImagePicker && ImagePicker.launchCameraAsync) {
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const filename = asset.uri.split('/').pop() || `camera_${Date.now()}.jpg`;
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image/jpeg',
          name: filename,
        };
      }
    }
    return null;
  } catch (err) {
    console.warn('Error launching camera:', err);
    return null;
  }
};

/**
 * Selects an image from media gallery.
 * @param {object} customOptions - Overriding options (allowsEditing, aspect, quality)
 * @returns {Promise<object|null>} Object with { uri, width, height, type, name } or null
 */
export const pickImageFromGallery = async (customOptions = {}) => {
  try {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return null;

    const options = { ...DEFAULT_OPTIONS, ...customOptions };

    if (ImagePicker && ImagePicker.launchImageLibraryAsync) {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const filename = asset.uri.split('/').pop() || `photo_${Date.now()}.jpg`;
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image/jpeg',
          name: filename,
        };
      }
    }
    return null;
  } catch (err) {
    console.warn('Error picking image from gallery:', err);
    return null;
  }
};

export default {
  pickImageFromCamera,
  pickImageFromGallery,
};

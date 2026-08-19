/**
 * textToSpeech.js
 * Text-to-Speech (TTS) Engine for NIVARA.
 * Provides voice-assisted AAC speech synthesis with dynamic sensory-friendly tone and pitch adaptation.
 */

import useSensoryStore from '../../store/sensoryStore';

class TextToSpeechEngine {
  constructor() {
    this.speechEngine = null;
    this.currentlySpeaking = false;
    this.initEngine();
  }

  /**
   * Initializes expo-speech or Web SpeechSynthesis.
   */
  initEngine() {
    try {
      this.speechEngine = require('expo-speech');
    } catch (e) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        this.speechEngine = 'web';
      } else {
        this.speechEngine = null;
      }
    }
  }

  /**
   * Calculates sensory-friendly pitch and speech rate based on active noise level in sensoryStore.
   */
  getSensoryAdaptationOptions() {
    const sensoryState = useSensoryStore.getState();
    const noiseDb = sensoryState.noiseLevelDb || 70;
    const threshold = sensoryState.noiseThresholdDb || 85;

    let pitch = 1.0;
    let rate = 0.95;

    if (noiseDb >= threshold || sensoryState.activeAlert) {
      // High sensory overload risk: lower pitch, slower pace for calming effect
      pitch = 0.85;
      rate = 0.8;
    }

    return { pitch, rate };
  }

  /**
   * Speaks a provided text string aloud with sensory-adapted voice options.
   * @param {string} text - Text string to synthesize
   * @param {Object} [customOptions] - Optional pitch, rate, language overrides
   */
  async speak(text, customOptions = {}) {
    if (!text || typeof text !== 'string') throw new Error('Speech text is required');

    this.stop(); // Stop any ongoing speech

    const sensoryOpts = this.getSensoryAdaptationOptions();
    const options = {
      pitch: customOptions.pitch ?? sensoryOpts.pitch,
      rate: customOptions.rate ?? sensoryOpts.rate,
      language: customOptions.language || 'en-US',
      onStart: () => {
        this.currentlySpeaking = true;
        if (customOptions.onStart) customOptions.onStart();
      },
      onDone: () => {
        this.currentlySpeaking = false;
        if (customOptions.onDone) customOptions.onDone();
      },
      onStopped: () => {
        this.currentlySpeaking = false;
        if (customOptions.onStopped) customOptions.onStopped();
      },
      onError: (err) => {
        this.currentlySpeaking = false;
        console.warn('TTS Error:', err);
        if (customOptions.onError) customOptions.onError(err);
      },
    };

    if (this.speechEngine === 'web') {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = options.pitch;
        utterance.rate = options.rate;
        utterance.lang = options.language;
        utterance.onstart = () => options.onStart();
        utterance.onend = () => options.onDone();
        utterance.onerror = (e) => options.onError(e);

        this.currentlySpeaking = true;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Web SpeechSynthesis error:', err);
        this.currentlySpeaking = false;
        options.onError(err);
        throw err;
      }
    } else if (this.speechEngine && this.speechEngine.speak) {
      try {
        this.currentlySpeaking = true;
        this.speechEngine.speak(text, options);
      } catch (err) {
        console.warn('Expo Speech error:', err);
        this.currentlySpeaking = false;
        options.onError(err);
        throw err;
      }
    } else {
      console.log(`🔊 [Simulated TTS Output]: "${text}" (Pitch: ${options.pitch}, Rate: ${options.rate})`);
      this.currentlySpeaking = true;
      setTimeout(() => {
        this.currentlySpeaking = false;
        if (options.onDone) options.onDone();
      }, Math.max(1000, text.length * 80));
    }
  }

  /**
   * Pauses current speech output.
   */
  pause() {
    if (this.speechEngine === 'web' && window.speechSynthesis) {
      window.speechSynthesis.pause();
    } else if (this.speechEngine && this.speechEngine.stop) {
      this.speechEngine.stop();
    }
  }

  /**
   * Stops current speech output completely.
   */
  stop() {
    if (this.speechEngine === 'web' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    } else if (this.speechEngine && this.speechEngine.stop) {
      this.speechEngine.stop();
    }
    this.currentlySpeaking = false;
  }

  /**
   * Returns whether speech synthesis is currently active.
   */
  isSpeaking() {
    if (this.speechEngine === 'web' && window.speechSynthesis) {
      return window.speechSynthesis.speaking;
    }
    return this.currentlySpeaking;
  }
}

export const textToSpeech = new TextToSpeechEngine();
export default textToSpeech;

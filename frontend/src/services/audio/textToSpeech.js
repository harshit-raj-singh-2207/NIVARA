export const textToSpeech = {
  speak: async (text, options = {}) => {
    console.log(`[TextToSpeech Speaking]: "${text}" at rate ${options.rate || 1.0}`);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      window.speechSynthesis.speak(utterance);
    }
  },
  stop: async () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};

export default textToSpeech;

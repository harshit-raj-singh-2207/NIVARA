export const speechToText = {
  startListening: async (onResult) => {
    console.log('[SpeechToText] Listening started...');
    setTimeout(() => {
      onResult('I want to eat lunch');
    }, 2500);
  },
  stopListening: async () => {
    console.log('[SpeechToText] Listening stopped');
  }
};

export default speechToText;

/**
 * Custom React Hook: useCommunication
 * Connects components to useCommunicationStore for AAC symbol board selection, emotion state adaptation, sentence generation, and text simplification.
 */

import { useCallback } from 'react';
import useCommunicationStore from '../store/communicationStore';

export const useCommunication = () => {
  const {
    aacBoards,
    activeBoardId,
    customPhrases,
    activeEmotion,
    selectedStyle,
    inputText,
    suggestions,
    isLoading,
    error,
    setActiveBoardId,
    setActiveEmotion,
    setSelectedStyle,
    setInputText,
    addCustomPhrase,
    removeCustomPhrase,
    generateAISentences,
    simplifyInputText,
    sendQuickNeedAlert,
  } = useCommunicationStore();

  const activeBoard = aacBoards.find((b) => b.id === activeBoardId) || aacBoards[0];

  const handleGenerateAISentences = useCallback(
    async (customPrompt = '') => {
      return await generateAISentences(customPrompt);
    },
    [generateAISentences]
  );

  const handleSimplifyInputText = useCallback(async () => {
    return await simplifyInputText();
  }, [simplifyInputText]);

  return {
    aacBoards,
    activeBoard,
    activeBoardId,
    customPhrases,
    activeEmotion,
    selectedStyle,
    inputText,
    suggestions,
    isLoading,
    error,
    setActiveBoardId,
    setActiveEmotion,
    setSelectedStyle,
    setInputText,
    addCustomPhrase,
    removeCustomPhrase,
    generateAISentences: handleGenerateAISentences,
    simplifyInputText: handleSimplifyInputText,
    sendQuickNeedAlert,
  };
};

export default useCommunication;

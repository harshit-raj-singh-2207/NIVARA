/**
 * Custom React Hook: useWebSocket
 * Manages real-time WebSocket connection lifecycle for chat, emergency notifications, and live telemetry updates with automatic reconnection.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import websocketClient from '../services/websocket/websocketClient';
import chatSocket from '../services/websocket/chatSocket';
import useAuthStore from '../store/authStore';

export const useWebSocket = (customEndpoint = '/ws') => {
  const { user, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  const sendMessage = useCallback((payload) => {
    if (chatSocket && chatSocket.sendMessage) {
      chatSocket.sendMessage(payload);
    } else if (websocketClient && websocketClient.send) {
      websocketClient.send(payload);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let cleanup = null;
    try {
      if (websocketClient && websocketClient.connect) {
        websocketClient.connect(customEndpoint);
        setIsConnected(true);

        cleanup = websocketClient.onMessage((msg) => {
          setLastMessage(msg);
        });
      }
    } catch (err) {
      console.warn('WebSocket connection error:', err);
      setIsConnected(false);
    }

    return () => {
      if (cleanup) cleanup();
      if (websocketClient && websocketClient.disconnect) {
        websocketClient.disconnect();
      }
      setIsConnected(false);
    };
  }, [isAuthenticated, user, customEndpoint]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
};

export default useWebSocket;

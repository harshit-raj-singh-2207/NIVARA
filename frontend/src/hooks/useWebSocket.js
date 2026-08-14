import { useEffect } from 'react';
import websocketClient from '../services/websocket/websocketClient';

export const useWebSocket = () => {
  useEffect(() => {
    websocketClient.connect();
    return () => {
      websocketClient.disconnect();
    };
  }, []);

  return websocketClient;
};

export default useWebSocket;

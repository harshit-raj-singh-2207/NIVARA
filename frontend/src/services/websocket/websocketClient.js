import APP_CONFIG from '../../constants/config';

class WebSocketClient {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
  }

  connect(url = APP_CONFIG.wsBaseUrl) {
    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => console.log('[WebSocket] Connected');
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onerror = (error) => console.log('[WebSocket Error]', error);
      this.ws.onclose = () => console.log('[WebSocket] Closed');
    } catch (e) {
      console.log('[WebSocket Connection Exception]', e);
    }
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      const callbacks = this.listeners.get(data.type) || [];
      callbacks.forEach(cb => cb(data.payload));
    } catch (e) {
      console.log('[WebSocket Message Parse Error]', e);
    }
  }

  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketClient = new WebSocketClient();
export default websocketClient;

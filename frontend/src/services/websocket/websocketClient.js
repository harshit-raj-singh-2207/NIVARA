/**
 * websocketClient.js
 * Core WebSocket Connection Manager for NIVARA frontend.
 * Provides JWT authentication, exponential backoff auto-reconnect, keepalive heartbeats, and event emitter listeners.
 */

import { WS_URL } from '../../constants/api';
import secureStorage from '../storage/secureStorage';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.listeners = new Map(); // event -> Set<callback>
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimer = null;
    this.pingInterval = null;
  }

  /**
   * Establishes WebSocket connection with JWT access token authentication.
   */
  async connect() {
    if (this.isConnected || this.isConnecting) return;

    this.isConnecting = true;
    const token = await secureStorage.getAccessToken();
    const wsUrl = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.dispatchEvent('connection_status', { connected: true });
        console.log('✅ WebSocket Connected securely to:', WS_URL);
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'PONG') return;
          if (message.type && message.payload !== undefined) {
            this.dispatchEvent(message.type, message.payload);
          } else if (message.event && message.data !== undefined) {
            this.dispatchEvent(message.event, message.data);
          } else {
            this.dispatchEvent('message', message);
          }
        } catch (err) {
          console.warn('Failed to parse WebSocket message data:', event.data);
        }
      };

      this.socket.onerror = (error) => {
        console.warn('WebSocket error encountered:', error);
        this.dispatchEvent('error', error);
      };

      this.socket.onclose = (event) => {
        this.isConnected = false;
        this.isConnecting = false;
        this.stopHeartbeat();
        this.dispatchEvent('connection_status', { connected: false });

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else {
          console.warn('WebSocket max reconnect attempts reached.');
        }
      };
    } catch (err) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Schedules an auto-reconnect attempt using exponential backoff.
   */
  scheduleReconnect() {
    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 16000);
    console.log(`WebSocket reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Starts keepalive ping/pong heartbeat interval.
   */
  startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'PING' }));
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Registers an event listener callback.
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  /**
   * Removes an event listener callback.
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Dispatches event payload to registered callbacks.
   */
  dispatchEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in WebSocket listener for '${event}':`, err);
        }
      });
    }
  }

  /**
   * Emits JSON payload message to server socket.
   */
  emit(type, payload) {
    if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn(`Cannot emit '${type}': WebSocket is not connected.`);
    }
  }

  /**
   * Closes open WebSocket connection.
   */
  disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
  }
}

export const websocketClient = new WebSocketClient();
export default websocketClient;

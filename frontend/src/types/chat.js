/**
 * Direct & Group Chat Types
 */

export const createChatMessage = (data = {}) => ({
  id: data.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  senderId: data.senderId || '',
  senderName: data.senderName || '',
  senderAvatar: data.senderAvatar || null,
  text: data.text || '',
  timestamp: data.timestamp || new Date().toISOString(),
  isMe: data.isMe || false,
  status: data.status || 'SENT', // SENT, DELIVERED, READ
  attachmentUrl: data.attachmentUrl || null,
});

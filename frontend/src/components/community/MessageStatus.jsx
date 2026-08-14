import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export const MessageStatus = ({ status = 'SENT' }) => {
  if (status === 'READ') return <Ionicons name="checkmark-done" size={16} color="#6366F1" />;
  if (status === 'DELIVERED') return <Ionicons name="checkmark-done" size={16} color="#94A3B8" />;
  return <Ionicons name="checkmark" size={16} color="#94A3B8" />;
};

export default MessageStatus;

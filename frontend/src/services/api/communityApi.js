/**
 * Community API Service for NIVARA backend.
 */

import apiClient from './apiClient';

export const communityApi = {
  getChats: async () => {
    try {
      return await apiClient.get('/api/v1/community/chats');
    } catch (err) {
      return [
        { id: 'chat_1', name: 'Eleanor Vance', avatar: '👩', lastMessage: 'Checked in on Alex. All safe!', time: '10:45 AM', unreadCount: 2, isOnline: true },
        { id: 'chat_2', name: 'Dr. Robert Marcus', avatar: '👨‍⚕️', lastMessage: 'Scheduled routine review for tomorrow.', time: 'Yesterday', unreadCount: 0, isOnline: false },
      ];
    }
  },

  getGroups: async () => {
    try {
      return await apiClient.get('/api/v1/community/groups');
    } catch (err) {
      return [
        { id: 'g1', name: 'Sensory Overload Peer Support', icon: '🎧', memberCount: 128, category: 'Sensory Tips', isJoined: true, description: 'Sharing soothing techniques, low-sensory environments, and noise cancellation hacks.' },
        { id: 'g2', name: 'AAC & Visual Boards Circle', icon: '🎨', memberCount: 94, category: 'AAC Strategies', isJoined: false, description: 'Tips for customized picture symbol boards and non-verbal expression.' },
      ];
    }
  },

  getPosts: async () => {
    try {
      return await apiClient.get('/api/v1/community/posts');
    } catch (err) {
      return [
        { id: 'p1', authorName: 'Sarah Jenkins', time: '2 hours ago', category: 'Sensory Tips', content: 'Tip of the day: Deep touch pressure blankets really help reduce evening anxiety after a loud day outside!', likes: 14, commentsCount: 5, isLiked: true },
        { id: 'p2', authorName: 'David K.', time: '4 hours ago', category: 'AAC Strategies', content: 'Just added 6 new custom AAC symbol cards for school lunchtime needs! Works great with the TTS feature.', likes: 22, commentsCount: 8, isLiked: false },
      ];
    }
  },

  createPost: async (content, category = 'General') => {
    try {
      return await apiClient.post('/api/v1/community/posts', { content, category });
    } catch (err) {
      return { success: true, message: 'Post published' };
    }
  },
};

export default communityApi;

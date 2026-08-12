/**
 * Community Zustand Store for NIVARA frontend.
 * Manages social community feed posts, groups, and active topic filters.
 */

import { create } from 'zustand';
import communityApi from '../services/api/communityApi';

export const useCommunityStore = create((set, get) => ({
  posts: [
    { id: 'p1', authorName: 'Sarah Jenkins', time: '2 hours ago', category: 'Sensory Tips', content: 'Tip of the day: Deep touch pressure blankets really help reduce evening anxiety after a loud day outside!', likes: 14, commentsCount: 5, isLiked: true },
    { id: 'p2', authorName: 'David K.', time: '4 hours ago', category: 'AAC Strategies', content: 'Just added 6 new custom AAC symbol cards for school lunchtime needs! Works great with the TTS feature.', likes: 22, commentsCount: 8, isLiked: false },
  ],
  groups: [
    { id: 'g1', name: 'Sensory Overload Peer Support', icon: '🎧', memberCount: 128, category: 'Sensory Tips', isJoined: true, description: 'Sharing soothing techniques, low-sensory environments, and noise cancellation hacks.' },
    { id: 'g2', name: 'AAC & Visual Boards Circle', icon: '🎨', memberCount: 94, category: 'AAC Strategies', isJoined: false, description: 'Tips for customized picture symbol boards and non-verbal expression.' },
  ],
  resources: [
    { id: 'r1', title: 'Sensory Overload Prevention Guide', category: 'Sensory Tips', description: 'Actionable steps for managing noisy environments and light glare.' },
    { id: 'r2', title: 'AAC Visual Communication Manual', category: 'AAC Strategies', description: 'Best practices for picture board building and Text-to-Speech synthesis.' },
  ],
  selectedCategory: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,

  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchCommunityData: async () => {
    set({ isLoading: true, error: null });
    try {
      const postsData = await communityApi.getPosts();
      const groupsData = await communityApi.getGroups();
      set({ posts: postsData, groups: groupsData, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  toggleLikePost: (postId) => {
    const { posts } = get();
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const isLiked = !p.isLiked;
      return {
        ...p,
        isLiked,
        likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
      };
    });
    set({ posts: updated });
  },

  toggleJoinGroup: (groupId) => {
    const { groups } = get();
    const updated = groups.map((g) => {
      if (g.id !== groupId) return g;
      const isJoined = !g.isJoined;
      return {
        ...g,
        isJoined,
        memberCount: isJoined ? g.memberCount + 1 : Math.max(0, g.memberCount - 1),
      };
    });
    set({ groups: updated });
  },
}));

export default useCommunityStore;

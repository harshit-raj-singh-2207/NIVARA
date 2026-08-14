import { create } from 'zustand';

export const useCommunityStore = create((set, get) => ({
  activeFilter: 'ALL', // ALL, CAREGIVERS, RESOURCES, DISCUSSIONS
  posts: [
    {
      id: 'post_1',
      authorName: 'Sunita Patel',
      authorRole: 'Parent & Occupational Educator',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      content: 'Sharing a wonderful visual routine checklist that worked wonders for my 8-year-old during morning transitions! Feel free to copy our schedule format.',
      tags: ['Routine', 'AutismSupport', 'VisualSchedule'],
      likesCount: 24,
      commentsCount: 8,
      isLiked: false,
      createdAt: '2 hours ago',
    },
    {
      id: 'post_2',
      authorName: 'Dr. Rahul Mehta',
      authorRole: 'Pediatric Neurologist',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      content: 'Tips for managing sensory overload in crowded places: Always carry noise-canceling headphones, create a 5-minute exit plan, and use tactile fidgets.',
      tags: ['SensoryCare', 'ExpertAdvice', 'Decompression'],
      likesCount: 56,
      commentsCount: 19,
      isLiked: true,
      createdAt: '5 hours ago',
    }
  ],
  groups: [
    { id: 'grp_1', name: 'Neurodivergent Parents Circle', membersCount: 1420, category: 'Parent Support', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200', isJoined: true },
    { id: 'grp_2', name: 'Sensory Tool & AAC Tips', membersCount: 890, category: 'Communication', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200', isJoined: false },
    { id: 'grp_3', name: 'Special Educator Network', membersCount: 650, category: 'Education', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200', isJoined: true },
  ],

  toggleLikePost: (postId) => set(state => ({
    posts: state.posts.map(p => {
      if (p.id !== postId) return p;
      const isLiked = !p.isLiked;
      return {
        ...p,
        isLiked,
        likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
      };
    })
  })),

  addPost: (content, tags = []) => set(state => ({
    posts: [
      {
        id: `post_${Date.now()}`,
        authorName: 'Aarav Sharma',
        authorRole: 'Community Member',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        content,
        tags,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        createdAt: 'Just now',
      },
      ...state.posts
    ]
  })),

  setFilter: (filter) => set({ activeFilter: filter }),
}));

export default useCommunityStore;

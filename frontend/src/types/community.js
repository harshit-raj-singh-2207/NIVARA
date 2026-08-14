/**
 * Community Feed & Resource Types
 */

export const createPost = (data = {}) => ({
  id: data.id || `post_${Date.now()}`,
  authorName: data.authorName || 'Anonymous',
  authorRole: data.authorRole || 'Caregiver',
  authorAvatar: data.authorAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  content: data.content || '',
  tags: data.tags || [],
  likesCount: data.likesCount || 0,
  commentsCount: data.commentsCount || 0,
  createdAt: data.createdAt || new Date().toISOString(),
  isLiked: data.isLiked || false,
});

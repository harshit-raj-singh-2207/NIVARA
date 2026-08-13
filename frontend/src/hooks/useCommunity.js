/**
 * Custom React Hook: useCommunity
 * Connects community feed UI components to useCommunityStore for feed posts, group memberships, resource bookmarks, and category filters.
 */

import { useEffect, useCallback } from 'react';
import useCommunityStore from '../store/communityStore';

export const useCommunity = () => {
  const {
    posts,
    groups,
    resources,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    setSelectedCategory,
    setSearchQuery,
    fetchCommunityData,
    toggleLikePost,
    toggleJoinGroup,
  } = useCommunityStore();

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const filteredPosts = posts.filter((post) => {
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return {
    posts: filteredPosts,
    allPosts: posts,
    groups,
    resources,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    setSelectedCategory,
    setSearchQuery,
    refreshCommunityData: fetchCommunityData,
    toggleLikePost,
    toggleJoinGroup,
  };
};

export default useCommunity;

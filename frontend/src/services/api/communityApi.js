import apiClient from './apiClient';

export const communityApi = {
  getPosts: () => apiClient.get('/community/posts'),
  createPost: (post) => apiClient.post('/community/posts', post),
  getGroups: () => apiClient.get('/community/groups'),
};

export default communityApi;

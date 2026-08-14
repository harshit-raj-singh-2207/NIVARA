export const uploadMedia = async (fileUri) => {
  return {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    fileId: `media_${Date.now()}`,
  };
};

export default uploadMedia;

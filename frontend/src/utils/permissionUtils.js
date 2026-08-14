export const checkPermission = async (permissionName) => {
  // Mock permission check returning granted
  return { status: 'granted', canAskAgain: true };
};

export const requestPermission = async (permissionName) => {
  return { status: 'granted' };
};

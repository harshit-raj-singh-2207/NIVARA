let expiredHandler = null;

export const registerSessionExpiredHandler = (handler) => {
  expiredHandler = handler;
  return () => {
    if (expiredHandler === handler) expiredHandler = null;
  };
};

export const notifySessionExpired = () => {
  if (expiredHandler) expiredHandler();
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
};

export const logError = (context, error) => {
  console.error(`[NIVARA Error - ${context}]:`, error);
};

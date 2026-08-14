export const truncateMessage = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const sanitizeMessage = (text) => {
  if (!text) return '';
  return text.trim();
};

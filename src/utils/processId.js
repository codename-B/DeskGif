/**
 * Generate a unique process ID to prevent collisions
 * Combines timestamp with random string for uniqueness
 * @param {string} prefix - Prefix for the process ID (e.g., 'ffmpeg', 'gifsicle')
 * @returns {string} - Unique process ID
 */
export const generateProcessId = (prefix = 'process') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11); // 9 chars
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Format seconds into HH:MM:SS format
 * @param {number} secs - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (secs) => {
  const h = Math.floor(secs / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};


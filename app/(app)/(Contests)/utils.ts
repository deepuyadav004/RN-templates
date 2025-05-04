// Utility functions for formatting and other operations

// Convert seconds to days, hours, minutes format
export const formatTimeRemaining = (startTime: number) => {
  const now = Math.floor(Date.now() / 1000);
  const remainingSeconds = startTime - now;
  
  if (remainingSeconds <= 0) return 'Starting soon';
  
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
};

// Format duration from seconds or minutes to hours and minutes
export const formatDuration = (duration: number | string, isMinutes = false) => {
  let durationSecs = typeof duration === 'string' ? parseInt(duration) : duration;
  if (isMinutes) durationSecs *= 60;
  
  const hours = Math.floor(durationSecs / 3600);
  const minutes = Math.floor((durationSecs % 3600) / 60);
  
  return `${hours}h ${minutes}m`;
};

// Convert timestamp to readable date and time
export const formatStartTime = (timestamp: number | string) => {
  const date = typeof timestamp === 'number' 
    ? new Date(timestamp * 1000) 
    : new Date(timestamp);
    
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get platform-specific colors
export const getPlatformColors = (platform: string) => {
  switch (platform) {
    case 'codeforces':
      return { badge: '#5D3FD3', countdown: 'rgba(93, 63, 211, 0.9)' };
    case 'codechef':
      return { badge: '#EC5B45', countdown: 'rgba(236, 91, 69, 0.9)' };
    case 'leetcode':
      return { badge: '#FFA116', countdown: 'rgba(255, 161, 22, 0.9)' };
    default:
      return { badge: '#5D3FD3', countdown: 'rgba(93, 63, 211, 0.9)' };
  }
};

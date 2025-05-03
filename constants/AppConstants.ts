// Storage keys
export const STORAGE_KEYS = {
  USERNAMES: 'platform_usernames',
};

// Default platform data
export const PLATFORM_DATA = {
  CODEFORCES: {
    PLATFORM_NAME: "Codeforces",
    BACKGROUND_COLOR: '#E9F5FE',
    TEXT_COLOR: '#4285F4',
    LOGO_URI: "https://codeforces.org/s/0/favicon-32x32.png",
  },
  LEETCODE: {
    PLATFORM_NAME: "LeetCode",
    BACKGROUND_COLOR: '#FFF4E6',
    TEXT_COLOR: '#FFA116',
    LOGO_URI: "https://leetcode.com/static/images/LeetCode_logo_rvs.png",
  },
  CODECHEF: {
    PLATFORM_NAME: "CodeChef",
    BACKGROUND_COLOR: '#F1F8E9',
    TEXT_COLOR: '#7E8D64',
    LOGO_URI: "https://cdn.codechef.com/images/cc-logo.svg",
  },
};

// API Endpoints
export const API = {
  CODEFORCES: {
    USER_INFO: 'https://codeforces.com/api/user.info',
  },
  LEETCODE: {
    USER_INFO: 'https://alfa-leetcode-api.onrender.com',
  },
  // Add other platform APIs here
};

// UI constants
export const UI = {
  PADDING: {
    HORIZONTAL: 16,
    VERTICAL: 20,
  },
  MARGIN: {
    BOTTOM: 15,
    TOP: 50,
  },
  BORDER_RADIUS: {
    CARD: 15,
    BUTTON: 10,
  },
  CONTAINER_OPACITY: 0.3,
  BOTTOM_PADDING: 90,
  MODAL: {
    BACKGROUND_OPACITY: 0.5,
    CONTAINER_OPACITY: 0.95,
  },
  ICONS: {
    SIZE: {
      SMALL: 16,
      MEDIUM: 24,
      LARGE: 32,
    },
  },
};

// Default sample data (for development purposes)
export const SAMPLE_DATA = {
  CODEFORCES: {
    RATING: 1432,
    MAX_RATING: 1523,
    RANK: "Specialist",
  },
  LEETCODE: {
    RATING: 1845,
    MAX_RATING: 1910,
    RANK: "Guardian",
  },
  CODECHEF: {
    RATING: 1692,
    MAX_RATING: 1720,
    RANK: "3★",
  },
};

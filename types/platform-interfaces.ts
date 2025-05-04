export interface CodeforcesUserInfo {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  titlePhoto: string;
}

export interface LeetcodeUserInfo {
  username: string;
  rating: number;
  badge: string;
  globalRanking: number;
  totalParticipants: number;
}

export interface CodechefUserInfo {
  name: string;
  currentRating: number;
  highestRating: number;
  stars: string;
  globalRank: number;
  countryRank: number;
  profile?: string;
  countryName?: string;
}

export interface PlatformData {
  platformName: string;
  rating: number;
  username: string;
  maxRating: number;
  rank: string;
  backgroundColor: string;
  textColor: string;
  logoUri: string;
  isError: boolean;
  errorMessage: string;
}

export interface RatingsData {
  codeforces: PlatformData;
  leetcode: PlatformData;
  codechef: PlatformData;
}

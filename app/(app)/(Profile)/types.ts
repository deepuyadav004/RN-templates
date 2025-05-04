export interface CodechefAPIResponse {
  success: boolean;
  status: number;
  currentRating?: number;
  highestRating?: number;
  stars?: string;
  cachedAt?: number;
}

export interface PlatformUsernamesData {
  codeforces: string;
  leetcode: string;
  codechef: string;
}

export interface SectionProps {
  userData: PlatformUsernamesData;
  ratingsData: any;
  latestCodechefData?: CodechefAPIResponse | null;
}

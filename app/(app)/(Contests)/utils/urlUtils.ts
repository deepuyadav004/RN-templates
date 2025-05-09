import { Contest, CodeforcesContest, CodechefContest, LeetcodeContest } from '../types';

// Function to get the URL for a contest based on platform
export const getPlatformContestUrl = (contest: Contest): string => {
  if (!contest) return '';
  
  try {
    if (contest.platform === 'codeforces') {
      const cfContest = contest as CodeforcesContest;
      return `https://codeforces.com/contests/${cfContest.id}`;
    } else if (contest.platform === 'codechef') {
      const ccContest = contest as CodechefContest;
      return ccContest.contest_url || `https://www.codechef.com/contests`;
    } else if (contest.platform === 'leetcode') {
      const lcContest = contest as LeetcodeContest;
      return `https://leetcode.com/contest/${lcContest.titleSlug}`;
    }
    return '';
  } catch (error) {
    console.error('Error getting contest URL:', error);
    return '';
  }
};

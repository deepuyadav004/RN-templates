import { CodeforcesContest, CodechefContest, LeetcodeContest } from '../types';

export const fetchCodeforces = async (): Promise<CodeforcesContest[]> => {
  try {
    const response = await fetch('https://codeforces.com/api/contest.list');
    const data = await response.json();
    
    if (data.status === 'OK') {
      // Filter contests with phase "BEFORE" and add platform identifier
      return data.result
        .filter((contest: any) => contest.phase === 'BEFORE')
        .map((contest: any) => ({
          ...contest,
          platform: 'codeforces'
        }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching Codeforces contests:', err);
    return [];
  }
};

export const fetchCodechef = async (): Promise<CodechefContest[]> => {
  try {
    const response = await fetch('https://www.codechef.com/api/list/contests/all');
    const data = await response.json();
    
    if (data.status === 'success') {
      // Map future contests and add platform identifier
      return data.future_contests.map((contest: any) => ({
        ...contest,
        platform: 'codechef'
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching CodeChef contests:', err);
    return [];
  }
};

export const fetchLeetcode = async (): Promise<LeetcodeContest[]> => {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "query getContestList { allContests { title startTime duration titleSlug } }"
      })
    });
    
    const data = await response.json();
    
    if (data.data && data.data.allContests) {
      const now = Date.now() / 1000;
      
      // Filter only upcoming contests and add platform identifier
      return data.data.allContests
        .filter((contest: any) => contest.startTime > now)
        .map((contest: any) => ({
          ...contest,
          platform: 'leetcode'
        }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching LeetCode contests:', err);
    return [];
  }
};

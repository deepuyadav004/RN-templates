import { Contest, CodeforcesContest, CodechefContest, LeetcodeContest } from '../types';

export const formatContestDate = (contest: Contest): string => {
  if (!contest) {
    return 'Date unavailable';
  }

  let timestamp: number;
  
  try {
    if (contest.platform === 'codeforces') {
      const cfContest = contest as CodeforcesContest;
      timestamp = cfContest.startTimeSeconds ? cfContest.startTimeSeconds * 1000 : 0;
    } else if (contest.platform === 'codechef') {
      const ccContest = contest as CodechefContest;
      timestamp = ccContest.contest_start_date_iso ? 
        new Date(ccContest.contest_start_date_iso).getTime() : 0;
    } else if (contest.platform === 'leetcode') { // leetcode
      const lcContest = contest as LeetcodeContest;
      timestamp = lcContest.startTime ? lcContest.startTime * 1000 : 0;
    } else {
      return 'Invalid platform';
    }

    if (!timestamp) {
      return 'Date unavailable';
    }
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting contest date:', error);
    return 'Date error';
  }
};

export const formatContestDuration = (contest: Contest): string => {
  if (!contest) {
    return 'Duration unavailable';
  }

  let durationSeconds: number = 0;
  
  try {
    if (contest.platform === 'codeforces') {
      const cfContest = contest as CodeforcesContest;
      durationSeconds = cfContest.durationSeconds || 0;
    } else if (contest.platform === 'codechef') {
      const ccContest = contest as CodechefContest;
      durationSeconds = ccContest.contest_duration ? ccContest.contest_duration * 60 : 0;
    } else if (contest.platform === 'leetcode') { // leetcode
      const lcContest = contest as LeetcodeContest;
      durationSeconds = lcContest.duration || 0;
    } else {
      return 'Invalid platform';
    }
    
    if (!durationSeconds) {
      return 'Duration unavailable';
    }
    
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  } catch (error) {
    console.error('Error formatting contest duration:', error);
    return 'Duration error';
  }
};

// Function to get timestamp in milliseconds for the contest start time
export const getContestStartTimestamp = (contest: Contest): number => {
  if (!contest) {
    return 0;
  }

  try {
    if (contest.platform === 'codeforces') {
      const cfContest = contest as CodeforcesContest;
      return cfContest.startTimeSeconds ? cfContest.startTimeSeconds * 1000 : 0;
    } else if (contest.platform === 'codechef') {
      const ccContest = contest as CodechefContest;
      return ccContest.contest_start_date_iso ? 
        new Date(ccContest.contest_start_date_iso).getTime() : 0;
    } else if (contest.platform === 'leetcode') { // leetcode
      const lcContest = contest as LeetcodeContest;
      return lcContest.startTime ? lcContest.startTime * 1000 : 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting contest start timestamp:', error);
    return 0;
  }
};

// Function to get seconds until 5 minutes before contest starts
export const getSecondsUntilNotification = (contest: Contest): number => {
  const startTimestamp = getContestStartTimestamp(contest);
  if (!startTimestamp) return 0;
  
  const now = Date.now();
  const fiveMinutesBeforeStart = startTimestamp - (5 * 60 * 1000);
  
  // If already past the notification time, return 0
  if (now >= fiveMinutesBeforeStart) return 0;
  
  // Return seconds until 5 minutes before the contest
  return Math.floor((fiveMinutesBeforeStart - now) / 1000);
};

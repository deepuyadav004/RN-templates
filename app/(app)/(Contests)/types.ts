// Contest interfaces
export interface CodeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds: number;
  platform: 'codeforces';
}

export interface CodechefContest {
  contest_code: string;
  contest_name: string;
  contest_start_date_iso: string;
  contest_end_date_iso: string;
  contest_duration: string;
  platform: 'codechef';
}

export interface LeetcodeContest {
  title: string;
  startTime: number;
  duration: number;
  titleSlug: string;
  platform: 'leetcode';
}

// Combined contest type for our display
export type Contest = CodeforcesContest | CodechefContest | LeetcodeContest;

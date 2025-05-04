import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contest, CodeforcesContest, CodechefContest, LeetcodeContest } from '../types';
import { formatStartTime, formatDuration, formatTimeRemaining, getPlatformColors } from '../utils';
import { contestStyles } from '../styles';

interface ContestCardProps {
  item: Contest;
}

const ContestCard: React.FC<ContestCardProps> = ({ item }) => {
  const platform = item.platform;
  const colors = getPlatformColors(platform);
  
  // Get contest details based on platform
  let contestName: string;
  let contestType: string;
  let startTime: number;
  let duration: number | string;
  
  if (platform === 'codeforces') {
    const contest = item as CodeforcesContest;
    contestName = contest.name;
    contestType = contest.type;
    startTime = contest.startTimeSeconds;
    duration = contest.durationSeconds;
  } else if (platform === 'codechef') {
    const contest = item as CodechefContest;
    contestName = contest.contest_name;
    contestType = 'CodeChef';
    startTime = new Date(contest.contest_start_date_iso).getTime() / 1000;
    duration = contest.contest_duration;
  } else { // leetcode
    const contest = item as LeetcodeContest;
    contestName = contest.title;
    contestType = 'LeetCode';
    startTime = contest.startTime;
    duration = contest.duration;
  }
  
  return (
    <TouchableOpacity style={contestStyles.contestCard}>
      <View style={[contestStyles.contestBadge, { backgroundColor: colors.badge }]}>
        <Text style={contestStyles.contestType}>{contestType}</Text>
      </View>
      
      <Text style={contestStyles.contestName}>{contestName}</Text>
      
      <View style={contestStyles.timeInfoContainer}>
        <View style={contestStyles.timeInfoItem}>
          <Ionicons name="calendar-outline" size={18} color={colors.badge} />
          <Text style={contestStyles.timeInfoText}>
            {formatStartTime(startTime)}
          </Text>
        </View>
        
        <View style={contestStyles.divider} />
        
        <View style={contestStyles.timeInfoItem}>
          <Ionicons name="time-outline" size={18} color={colors.badge} />
          <Text style={contestStyles.timeInfoText}>
            {platform === 'codechef' 
              ? formatDuration(duration, true) 
              : formatDuration(duration as number)}
          </Text>
        </View>
      </View>
      
      <View style={[contestStyles.countdownContainer, { backgroundColor: colors.countdown }]}>
        <Ionicons name="hourglass-outline" size={20} color="#fff" />
        <Text style={contestStyles.countdownText}>
          Starts in: {formatTimeRemaining(startTime)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ContestCard;

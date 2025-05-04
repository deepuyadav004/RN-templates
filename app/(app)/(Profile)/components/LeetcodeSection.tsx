import React from 'react';
import { View, Text, Animated } from 'react-native';
import { SectionProps } from '../types';
import { profileStyles } from '../styles';
import { sharedScrollHandler } from '../utils/animationHelpers';
import Leetcode from '@/components/leetcode/Leetcode';
import RatingCard from '@/components/ratingCard';
import LeetCodeProgressRings from '@/components/charts/LeetCodeProgressRings';
import LeetCodeContestChart from '@/components/charts/LeetCodeContestChart';
import LeetCodeSkillStats from '@/components/charts/LeetCodeSkillStats';

const LeetcodeSection: React.FC<SectionProps> = ({ userData, ratingsData }) => {
  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={sharedScrollHandler}
      scrollEventThrottle={16}
    >
      <View style={profileStyles.platformContainer}>
        {userData.leetcode && (
          <Leetcode userName={userData.leetcode} />
        )}

        <View style={profileStyles.cardContainer}>
          <View style={profileStyles.sectionTitleContainer}>
            <Text style={profileStyles.sectionTitle}>Performance Stats</Text>
          </View>
          {ratingsData && ratingsData.leetcode ? (
            <RatingCard {...ratingsData.leetcode} />
          ) : (
            <View style={profileStyles.placeholderCard}>
              <Text style={profileStyles.placeholderText}>
                Rating information will appear here
              </Text>
            </View>
          )}
        </View>

        {userData.leetcode && (
          <LeetCodeProgressRings
            key={`leetcode-rings-${userData.leetcode}`}
            username={userData.leetcode}
          />
        )}

        {userData.leetcode && (
          <LeetCodeContestChart
            key={`leetcode-contest-${userData.leetcode}`}
            username={userData.leetcode}
          />
        )}

        {userData.leetcode && (
          <LeetCodeSkillStats
            key={`leetcode-skills-${userData.leetcode}`}
            username={userData.leetcode}
          />
        )}
      </View>
    </Animated.ScrollView>
  );
};

export default LeetcodeSection;

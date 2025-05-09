import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, ActivityIndicator } from 'react-native';
import { SectionProps } from '../types';
import { profileStyles } from '../styles';
import { sharedScrollHandler } from '../utils/animationHelpers';
import Leetcode from '@/components/leetcode/Leetcode';
import LeetCodeProgressRings from '@/components/charts/LeetCodeProgressRings';
import LeetCodeContestChart from '@/components/charts/LeetCodeContestChart';
import LeetCodeSkillStats from '@/components/charts/LeetCodeSkillStats';
import PlatformCards from '@/components/cards/PlatformCards';
import { fetchLatestLeetcodeData } from '../utils/leetcodeHelpers';

const LeetcodeSection: React.FC<SectionProps> = ({ userData, ratingsData }) => {
  const [freshRatingsData, setFreshRatingsData] = useState(ratingsData);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingLeetcode = useRef(false);

  useEffect(() => {
    // Update with fresh data when component mounts
    if (userData.leetcode) {
      setIsLoading(true);
      fetchLatestLeetcodeData(
        userData.leetcode,
        isFetchingLeetcode,
        freshRatingsData,
        null,
        () => {}, // No need to set latest data
        (newData) => {
          setFreshRatingsData(newData);
          setIsLoading(false);
        },
        true // Force refresh
      ).catch(() => {
        setIsLoading(false);
      });
    }
  }, [userData.leetcode]);

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
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFA116" style={{padding: 20}} />
          ) : (
            freshRatingsData && (
              <PlatformCards 
                ratingsData={{ 
                  leetcode: {
                    ...freshRatingsData.leetcode,
                    maxRating: null // Set maxRating to null to hide it
                  },
                  codeforces: { ...freshRatingsData.codeforces, isHidden: true },
                  codechef: { ...freshRatingsData.codechef, isHidden: true } 
                }}
                onEditPress={() => {}}
                hideEditButton={true}
              />
            )
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

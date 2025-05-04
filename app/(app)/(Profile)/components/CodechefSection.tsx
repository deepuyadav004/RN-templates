import React, { useMemo } from 'react';
import { View, Text, Animated } from 'react-native';
import { SectionProps } from '../types';
import { profileStyles } from '../styles';
import { sharedScrollHandler } from '../utils/animationHelpers';
import Codechef from '@/components/codechef/Codechef';
import RatingCard from '@/components/ratingCard';
import CodechefActivityHeatmap from '@/components/charts/CodechefActivityHeatmap';

const CodechefSection: React.FC<SectionProps> = ({ 
  userData, 
  ratingsData, 
  latestCodechefData 
}) => {
  const codechefRatingData = useMemo(() => {
    if (!ratingsData?.codechef) {
      return {
        platformName: "CodeChef",
        username: userData.codechef || 'Not set',
        rating: 0,
        maxRating: 0,
        rank: "N/A",
        backgroundColor: '#F1F8E9',
        textColor: '#7E8D64',
        logoUri: "https://cdn.codechef.com/images/cc-logo.svg",
      };
    }

    return {
      ...ratingsData.codechef,
      rating: latestCodechefData?.currentRating || ratingsData.codechef.rating,
      maxRating: latestCodechefData?.highestRating || ratingsData.codechef.maxRating,
      rank: latestCodechefData?.stars || ratingsData.codechef.rank
    };
  }, [ratingsData?.codechef, latestCodechefData, userData.codechef]);

  const heatmapKey = useMemo(() =>
    `codechef-activity-${userData.codechef || 'default'}-${Date.now()}`,
    [userData.codechef]
  );

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={sharedScrollHandler}
      scrollEventThrottle={16}
    >
      <View style={profileStyles.platformContainer}>
        {userData.codechef && (
          <Codechef userName={userData.codechef} />
        )}

        <View style={profileStyles.cardContainer}>
          <View style={profileStyles.sectionTitleContainer}>
            <Text style={profileStyles.sectionTitle}>Performance Stats</Text>
          </View>
          <RatingCard {...codechefRatingData} />
        </View>

        {userData.codechef && (
          <CodechefActivityHeatmap
            key={heatmapKey}
            username={userData.codechef}
            existingRatingData={codechefRatingData}
            skipDataFetch={!!latestCodechefData}
          />
        )}
      </View>
    </Animated.ScrollView>
  );
};

export default CodechefSection;

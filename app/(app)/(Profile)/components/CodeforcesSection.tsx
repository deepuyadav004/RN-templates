import React from 'react';
import { View, Text, Animated } from 'react-native';
import { SectionProps } from '../types';
import { profileStyles } from '../styles';
import { sharedScrollHandler } from '../utils/animationHelpers';
import Codeforces from '@/components/codeforces/Codeforces';
import RatingCard from '@/components/ratingCard';
import CodeforcesRatingChart from '@/components/charts/CodeforcesRatingChart';
import CodeforcesProblemTags from '@/components/charts/CodeforcesProblemTags';
import CodeforcesProblemDifficulty from '@/components/charts/CodeforcesProblemDifficulty';

const CodeforcesSection: React.FC<SectionProps> = ({ userData, ratingsData }) => {
  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={sharedScrollHandler}
      scrollEventThrottle={16}
    >
      <View style={profileStyles.platformContainer}>
        {userData.codeforces && (
          <Codeforces userName={userData.codeforces} />
        )}

        <View style={profileStyles.cardContainer}>
          <View style={profileStyles.sectionTitleContainer}>
            <Text style={profileStyles.sectionTitle}>Performance Stats</Text>
          </View>
          {ratingsData && ratingsData.codeforces ? (
            <RatingCard {...ratingsData.codeforces} />
          ) : (
            <View style={profileStyles.placeholderCard}>
              <Text style={profileStyles.placeholderText}>
                Rating information will appear here
              </Text>
            </View>
          )}
        </View>

        {userData.codeforces && (
          <CodeforcesRatingChart username={userData.codeforces} />
        )}

        {userData.codeforces && (
          <CodeforcesProblemTags username={userData.codeforces} />
        )}

        {userData.codeforces && (
          <CodeforcesProblemDifficulty username={userData.codeforces} />
        )}
      </View>
    </Animated.ScrollView>
  );
};

export default CodeforcesSection;

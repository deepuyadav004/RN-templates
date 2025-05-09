import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator } from 'react-native';
import { SectionProps } from '../types';
import { profileStyles } from '../styles';
import { sharedScrollHandler } from '../utils/animationHelpers';
import Codechef from '@/components/codechef/Codechef';
import RatingCard from '@/components/ratingCard';
import CodechefActivityHeatmap from '@/components/charts/CodechefActivityHeatmap';
import usePlatformService from '@/hooks/usePlatformService';

const CodechefSection: React.FC<SectionProps> = ({ userData }) => {
  const platformService = usePlatformService();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const refreshData = async () => {
      if (userData.codechef) {
        setIsLoading(true);
        try {
          await platformService.updateCodechefData(userData.codechef);
        } catch (error) {
          console.error('Error refreshing CodeChef data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    refreshData();
  }, [userData.codechef]);

  const heatmapKey = `codechef-activity-${userData.codechef || 'default'}-${Date.now()}`;

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
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#7E8D64" style={{padding: 20}} />
          ) : (
            <RatingCard {...platformService.ratingsData.codechef} />
          )}
        </View>

        {userData.codechef && (
          <CodechefActivityHeatmap
            key={heatmapKey}
            username={userData.codechef}
            existingRatingData={platformService.ratingsData.codechef}
            forceRefresh={true}
          />
        )}
      </View>
    </Animated.ScrollView>
  );
};

export default CodechefSection;

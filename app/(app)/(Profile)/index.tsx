import { View, Text, TouchableOpacity, ImageBackground, Animated, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/AppConstants';
import { profileStyles, TAB_WIDTH } from './styles';
import { CodechefAPIResponse, PlatformUsernamesData } from './types';
import { headerScrollY, headerShowAnimation } from './utils/animationHelpers';
import { fetchLatestCodechefData } from './utils/codechefHelpers';
import CodeforcesSection from './components/CodeforcesSection';
import LeetcodeSection from './components/LeetcodeSection';
import CodechefSection from './components/CodechefSection';

const ProfileScreen = () => {
  const [headerValue, setHeaderValue] = useState("Codeforces");
  const [userData, setUserData] = useState<PlatformUsernamesData>({
    codeforces: '',
    leetcode: '',
    codechef: ''
  });
  const [ratingsData, setRatingsData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [latestCodechefData, setLatestCodechefData] = useState<CodechefAPIResponse | null>(null);
  const isFetchingCodechef = useRef(false);

  const [codechefTabVisited, setCodechefTabVisited] = useState(false);
  const [codechefSectionKey, setCodechefSectionKey] = useState(Date.now());

  const headerTranslateY = headerScrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, -25, -50],
    extrapolate: 'clamp'
  });

  const headerTransform = [
    { translateY: Animated.multiply(headerTranslateY, headerShowAnimation) }
  ];

  // Add animation for tab indicator
  const tabIndicatorPosition = useMemo(() => {
    const platforms = ['Codeforces', 'Leetcode', 'Codechef'];
    const index = platforms.indexOf(headerValue);
    return new Animated.Value(index * (TAB_WIDTH));
  }, []);

  // Update tab indicator position when headerValue changes
  useEffect(() => {
    const platforms = ['Codeforces', 'Leetcode', 'Codechef'];
    const index = platforms.indexOf(headerValue);
    Animated.spring(tabIndicatorPosition, {
      toValue: index * (TAB_WIDTH),
      useNativeDriver: true,
      friction: 8,
      tension: 300
    }).start();
  }, [headerValue]);

  const refreshData = useCallback(() => {
    setLastRefresh(Date.now());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshData();

      const intervalId = setInterval(() => {
        refreshData();
      }, 5000);

      return () => clearInterval(intervalId);
    }, [])
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsernames = await AsyncStorage.getItem(STORAGE_KEYS.USERNAMES);
        if (storedUsernames) {
          try {
            const usernames = JSON.parse(storedUsernames);
            if (usernames && typeof usernames === 'object') {
              const hasChanged =
                usernames.codeforces !== userData.codeforces ||
                usernames.leetcode !== userData.leetcode ||
                usernames.codechef !== userData.codechef;

              setUserData({
                codeforces: usernames.codeforces || '',
                leetcode: usernames.leetcode || '',
                codechef: usernames.codechef || ''
              });

              if (hasChanged) {
                console.log("Usernames have changed, updating ratings data");
              }

              // Load ratings data from storage
              // ...existing code for loading ratings data...
              try {
                const possibilities = [
                  'platform_ratings_data',
                  'ratings_data',
                  'app_ratings_data',
                  STORAGE_KEYS.RATINGS_DATA,
                  'platform_data'
                ];

                let realRatingsData = null;

                for (const key of possibilities) {
                  if (!key) continue;

                  const data = await AsyncStorage.getItem(key);
                  if (data) {
                    try {
                      const parsed = JSON.parse(data);
                      if (parsed &&
                        (parsed.codeforces || parsed.leetcode || parsed.codechef)) {
                        realRatingsData = parsed;
                        console.log(`Found ratings data using key: ${key}`);
                        break;
                      }
                    } catch (e) {
                      console.log(`Failed to parse data from key: ${key}`);
                    }
                  }
                }

                if (realRatingsData) {
                  setRatingsData(realRatingsData);
                  return;
                }
              } catch (storageError) {
                console.log('Error trying to find ratings data:', storageError);
              }

              // Fall back to default data
              setTimeout(() => {
                const platformData = {
                  codeforces: {
                    platformName: "Codeforces",
                    username: usernames.codeforces || 'Not set',
                    rating: 1432,
                    maxRating: 1523,
                    rank: "Specialist",
                    backgroundColor: '#E9F5FE',
                    textColor: '#4285F4',
                    logoUri: "https://codeforces.org/s/0/favicon-32x32.png",
                  }
                };

                if (usernames.leetcode) {
                  platformData.leetcode = {
                    platformName: "Leetcode",
                    username: usernames.leetcode,
                    rating: 1845,
                    maxRating: 1910,
                    rank: "Guardian",
                    backgroundColor: '#FFF4E6',
                    textColor: '#FFA116',
                    logoUri: "https://leetcode.com/static/images/LeetCode_logo_rvs.png",
                  };
                }

                if (usernames.codechef) {
                  platformData.codechef = {
                    platformName: "CodeChef",
                    username: usernames.codechef,
                    rating: 1692,
                    maxRating: 1720,
                    rank: "3★",
                    backgroundColor: '#F1F8E9',
                    textColor: '#7E8D64',
                    logoUri: "https://cdn.codechef.com/images/cc-logo.svg",
                  };
                }

                setRatingsData(platformData);
              }, 500);
            }
          } catch (parseError) {
            console.error('Error parsing usernames JSON:', parseError);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadUserData();
  }, [lastRefresh]);

  useEffect(() => {
    if (headerValue === "Codechef") {
      if (!codechefTabVisited) {
        setCodechefTabVisited(true);
        setLatestCodechefData(null);
      } else {
        setCodechefSectionKey(Date.now());
      }
    }
  }, [headerValue]);

  useEffect(() => {
    setLatestCodechefData(null);
    setCodechefTabVisited(false);
  }, [userData.codechef]);

  useEffect(() => {
    if (headerValue === "Codechef" && userData.codechef) {
      if (!latestCodechefData) {
        fetchLatestCodechefData(
          userData.codechef,
          isFetchingCodechef,
          ratingsData,
          latestCodechefData,
          setLatestCodechefData,
          setRatingsData
        );
      }
    }
  }, [headerValue, userData.codechef, latestCodechefData, ratingsData]);

  return (
    <View style={profileStyles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={profileStyles.backgroundImage}
      >
        <View style={profileStyles.overlay}>
          <Animated.View
            style={[
              profileStyles.headerContainer,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transform: headerTransform,
                opacity: headerShowAnimation,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                paddingTop: 50,
                paddingBottom: 10,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 5,
              }
            ]}
          >
            <View style={profileStyles.navBarContainer}>
              {['Codeforces', 'Leetcode', 'Codechef'].map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={profileStyles.navTab}
                  onPress={() => setHeaderValue(platform)}
                >
                  <Text
                    style={[
                      profileStyles.navTabText,
                      headerValue === platform && profileStyles.navTabTextActive
                    ]}
                  >
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
              <Animated.View 
                style={[
                  profileStyles.tabIndicator, 
                  { transform: [{ translateX: tabIndicatorPosition }] }
                ]} 
              />
            </View>
          </Animated.View>

          <View style={[profileStyles.contentContainer, { paddingTop: 100 }]}>
            {headerValue === "Codeforces" && (
              <CodeforcesSection userData={userData} ratingsData={ratingsData} />
            )}
            {headerValue === "Leetcode" && (
              <LeetcodeSection userData={userData} ratingsData={ratingsData} />
            )}
            {headerValue === "Codechef" && (
              <CodechefSection
                key={codechefSectionKey}
                userData={userData}
                ratingsData={ratingsData}
                latestCodechefData={latestCodechefData}
              />
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingCard: {
    width: '90%', // Adjusted width to match other cards
    flex: 1,
  },
});

export default ProfileScreen;
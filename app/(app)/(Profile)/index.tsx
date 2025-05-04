import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Animated, Dimensions } from 'react-native'
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '@/constants/Colors'
import Codechef from '@/components/codechef/Codechef'
import Codeforces from '@/components/codeforces/Codeforces'
import Leetcode from '@/components/leetcode/Leetcode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/constants/AppConstants'
import { ScrollView } from 'react-native-gesture-handler'
import RatingCard from '@/components/ratingCard';
import CodeforcesRatingChart from '@/components/charts/CodeforcesRatingChart';
import CodeforcesProblemTags from '@/components/charts/CodeforcesProblemTags';
import CodeforcesProblemDifficulty from '@/components/charts/CodeforcesProblemDifficulty';
import CodechefActivityHeatmap from '@/components/charts/CodechefActivityHeatmap';
import LeetCodeProgressRings from '@/components/charts/LeetCodeProgressRings';
import LeetCodeContestChart from '@/components/charts/LeetCodeContestChart';
import LeetCodeSkillStats from '@/components/charts/LeetCodeSkillStats';

interface CodechefAPIResponse {
  success: boolean;
  status: number;
  currentRating?: number;
  highestRating?: number;
  stars?: string;
  cachedAt?: number;
}

const CODECHEF_CACHE_KEY = 'cached_codechef_data';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

// Create a shared animated value for the header
const headerScrollY = new Animated.Value(0);
const headerShowAnimation = new Animated.Value(1);

// Get screen width for nav indicator animations
const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = SCREEN_WIDTH / 3;

// Create a shared scroll handler that can be used by all sections
const createScrollHandler = () => {
  const lastScrollY = { current: 0 };
  const scrollDirection = { current: 0 };

  return Animated.event(
    [{ nativeEvent: { contentOffset: { y: headerScrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        if (currentScrollY <= 0) {
          // At the top - always show header
          Animated.timing(headerShowAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }).start();
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - show header
          if (scrollDirection.current !== 1) {
            scrollDirection.current = 1;
            Animated.timing(headerShowAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true
            }).start();
          }
        } else if (currentScrollY > lastScrollY.current) {
          // Scrolling down - hide header after threshold
          if (scrollDirection.current !== -1 && currentScrollY > 100) {
            scrollDirection.current = -1;
            Animated.timing(headerShowAnimation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            }).start();
          }
        }
        lastScrollY.current = currentScrollY;
      }
    }
  );
};

// Shared scroll handler that all sections can use
const sharedScrollHandler = createScrollHandler();

const CodechefSection = ({ userData, ratingsData, latestCodechefData }) => {
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
      <View style={styles.platformContainer}>
        {userData.codechef && (
          <Codechef userName={userData.codechef} />
        )}

        <View style={styles.cardContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Performance Stats</Text>
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

const index = () => {
  const [headerValue, setHeaderValue] = useState("Codeforces")
  const [userData, setUserData] = useState({
    codeforces: '',
    leetcode: '',
    codechef: ''
  })
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

  const loadCachedCodechefData = useCallback(async (username: string) => {
    try {
      const cachedData = await AsyncStorage.getItem(`${CODECHEF_CACHE_KEY}_${username}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as CodechefAPIResponse;

        const now = Date.now();
        if (parsedData.cachedAt && now - parsedData.cachedAt < CACHE_EXPIRY) {
          console.log('Using cached CodeChef data for:', username);
          setLatestCodechefData(parsedData);

          if (ratingsData?.codechef) {
            const updatedRatingsData = {
              ...ratingsData,
              codechef: {
                ...ratingsData.codechef,
                rating: parsedData.currentRating || ratingsData.codechef.rating,
                maxRating: parsedData.highestRating || ratingsData.codechef.maxRating,
                rank: parsedData.stars || ratingsData.codechef.rank
              }
            };
            setRatingsData(updatedRatingsData);
          }

          return true;
        } else {
          console.log('Cached CodeChef data expired for:', username);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading cached CodeChef data:', error);
      return false;
    }
  }, [ratingsData]);

  const cacheCodechefData = useCallback(async (username: string, data: CodechefAPIResponse) => {
    try {
      const dataToCache = {
        ...data,
        cachedAt: Date.now()
      };

      await AsyncStorage.setItem(
        `${CODECHEF_CACHE_KEY}_${username}`,
        JSON.stringify(dataToCache)
      );
      console.log('Cached CodeChef data for:', username);
    } catch (error) {
      console.error('Error caching CodeChef data:', error);
    }
  }, []);

  const fetchLatestCodechefData = useCallback(async (username: string, forceRefresh = false) => {
    if (!username || (isFetchingCodechef.current && !forceRefresh)) return;

    try {
      isFetchingCodechef.current = true;

      if (!forceRefresh) {
        const cacheUsed = await loadCachedCodechefData(username);
        if (cacheUsed) {
          isFetchingCodechef.current = false;
          return;
        }
      }

      console.log('Fetching CodeChef data for:', username);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        if (data && data.success) {
          setLatestCodechefData(data);

          cacheCodechefData(username, data);

          if (ratingsData?.codechef) {
            const updatedRatingsData = {
              ...ratingsData,
              codechef: {
                ...ratingsData.codechef,
                rating: data.currentRating || ratingsData.codechef.rating,
                maxRating: data.highestRating || ratingsData.codechef.maxRating,
                rank: data.stars || ratingsData.codechef.rank
              }
            };
            setRatingsData(updatedRatingsData);
          }
        } else {
          console.log('API returned unsuccessful response:', data);
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error fetching latest CodeChef data:', error);

      if (!latestCodechefData && ratingsData?.codechef) {
        setLatestCodechefData({
          success: true,
          status: 200,
          currentRating: ratingsData.codechef.rating,
          highestRating: ratingsData.codechef.maxRating,
          stars: ratingsData.codechef.rank
        });
      }
    } finally {
      isFetchingCodechef.current = false;
    }
  }, [latestCodechefData, ratingsData, loadCachedCodechefData, cacheCodechefData]);

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

                setRatingsData(platformData); // Small delay to simulate loading
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
        fetchLatestCodechefData(userData.codechef);
      }
    }
  }, [headerValue, userData.codechef, fetchLatestCodechefData, latestCodechefData]);

  const renderCodeforcesSection = () => {
    return (
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={sharedScrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.platformContainer}>
          {userData.codeforces && (
            <Codeforces userName={userData.codeforces} />
          )}

          <View style={styles.cardContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Performance Stats</Text>
            </View>
            {ratingsData && ratingsData.codeforces ? (
              <RatingCard {...ratingsData.codeforces} />
            ) : (
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>
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

  const renderLeetcodeSection = () => {
    return (
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={sharedScrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.platformContainer}>
          {userData.leetcode && (
            <Leetcode userName={userData.leetcode} />
          )}

          <View style={styles.cardContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Performance Stats</Text>
            </View>
            {ratingsData && ratingsData.leetcode ? (
              <RatingCard {...ratingsData.leetcode} />
            ) : (
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.headerContainer,
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
            <View style={styles.navBarContainer}>
              {['Codeforces', 'Leetcode', 'Codechef'].map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={styles.navTab}
                  onPress={() => setHeaderValue(platform)}
                >
                  <Text
                    style={[
                      styles.navTabText,
                      headerValue === platform && styles.navTabTextActive
                    ]}
                  >
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
              <Animated.View 
                style={[
                  styles.tabIndicator, 
                  { transform: [{ translateX: tabIndicatorPosition }] }
                ]} 
              />
            </View>
          </Animated.View>

          <View style={[styles.contentContainer, { paddingTop: 100 }]}>
            {headerValue === "Codeforces" && renderCodeforcesSection()}
            {headerValue === "Leetcode" && renderLeetcodeSection()}
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
  )
}

export default index

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  navBarContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    height: 50,
  },
  navTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  navTabText: {
    fontFamily: 'Gudea-Regular',
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  navTabTextActive: {
    fontFamily: 'Gudea-Bold',
    color: Colors.CORAL,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: TAB_WIDTH,
    height: 3,
    backgroundColor: Colors.CORAL,
    borderRadius: 3,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  platformContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  cardContainer: {
    width: '100%',
    marginVertical: 15,
    alignItems: 'center',
  },
  sectionTitleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  placeholderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 22,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Gudea-Italic',
    color: '#555',
    textAlign: 'center',
  },
});
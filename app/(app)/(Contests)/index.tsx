import { View, Text, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Contest, CodeforcesContest, CodechefContest, LeetcodeContest } from './types';
import { contestStyles } from './styles';
import ContestCard from './components/ContestCard';
import { fetchCodeforces, fetchCodechef, fetchLeetcode } from './services/contestsService';

const ContestsScreen = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllContests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch contests from all three platforms in parallel
      const [codeforcesContests, codechefContests, leetcodeContests] = await Promise.all([
        fetchCodeforces(),
        fetchCodechef(),
        fetchLeetcode()
      ]);
      
      // Combine and sort all contests by start time
      const allContests = [...codeforcesContests, ...codechefContests, ...leetcodeContests].sort((a, b) => {
        let timeA: number;
        let timeB: number;
        
        if (a.platform === 'codeforces') {
          timeA = (a as CodeforcesContest).startTimeSeconds;
        } else if (a.platform === 'codechef') {
          timeA = new Date((a as CodechefContest).contest_start_date_iso).getTime() / 1000;
        } else { // leetcode
          timeA = (a as LeetcodeContest).startTime;
        }
        
        if (b.platform === 'codeforces') {
          timeB = (b as CodeforcesContest).startTimeSeconds;
        } else if (b.platform === 'codechef') {
          timeB = new Date((b as CodechefContest).contest_start_date_iso).getTime() / 1000;
        } else { // leetcode
          timeB = (b as LeetcodeContest).startTime;
        }
        
        return timeA - timeB;
      });
      
      setContests(allContests);
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError('Failed to fetch contests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllContests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllContests();
  };

  const ListHeaderComponent = () => (
    <Text style={contestStyles.title}>Upcoming Contests</Text>
  );

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={contestStyles.container}>
        <ImageBackground
          source={require('../../../assets/images/bgCfSection.png')}
          style={contestStyles.backgroundImage}
        >
          <View style={contestStyles.overlay}>
            <View style={contestStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D3FD3" />
              <Text style={contestStyles.loadingText}>Loading contests...</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={contestStyles.container}>
        <ImageBackground
          source={require('../../../assets/images/bgCfSection.png')}
          style={contestStyles.backgroundImage}
        >
          <View style={contestStyles.overlay}>
            <View style={contestStyles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={40} color="#ff6b6b" />
              <Text style={contestStyles.errorText}>{error}</Text>
              <TouchableOpacity style={contestStyles.retryButton} onPress={fetchAllContests}>
                <Text style={contestStyles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // Empty state
  if (contests.length === 0) {
    return (
      <View style={contestStyles.container}>
        <ImageBackground
          source={require('../../../assets/images/bgCfSection.png')}
          style={contestStyles.backgroundImage}
        >
          <View style={contestStyles.overlay}>
            <View style={contestStyles.emptyContainer}>
              <Ionicons name="calendar-outline" size={40} color="#5D3FD3" />
              <Text style={contestStyles.emptyText}>No upcoming contests found</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // Contests list
  return (
    <View style={contestStyles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={contestStyles.backgroundImage}
      >
        <View style={contestStyles.overlay}>
          <FlatList
            data={contests}
            renderItem={({ item }) => <ContestCard item={item} />}
            ListHeaderComponent={ListHeaderComponent}
            keyExtractor={(item) => {
              if (item.platform === 'codeforces') {
                return `cf-${(item as CodeforcesContest).id}`;
              } else if (item.platform === 'codechef') {
                return `cc-${(item as CodechefContest).contest_code}`;
              } else { // leetcode
                return `lc-${(item as LeetcodeContest).titleSlug}`;
              }
            }}
            contentContainerStyle={contestStyles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#5D3FD3"]} />
            }
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ContestsScreen;

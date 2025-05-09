import { View, Text, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Contest, CodeforcesContest, CodechefContest, LeetcodeContest } from './types';
import { contestStyles } from './styles';
import ContestCard from './components/ContestCard';
import { fetchCodeforces, fetchCodechef, fetchLeetcode } from './services/contestsService';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContestsScreen = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notifiedContests, setNotifiedContests] = useState<string[]>([]);

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

  const getSecondsUntilNotification = (contest: Contest) => {
    let startTimeMs = 0;

    if (contest.platform === 'codeforces') {
      startTimeMs = (contest as CodeforcesContest).startTimeSeconds * 1000;
    } else if (contest.platform === 'codechef') {
      startTimeMs = new Date((contest as CodechefContest).contest_start_date_iso).getTime();
    } else { // leetcode
      startTimeMs = (contest as LeetcodeContest).startTime * 1000;
    }

    const currentTimeMs = Date.now();
    const notificationTimeMs = startTimeMs - 5 * 60 * 1000; // 5 minutes before start
    return Math.floor((notificationTimeMs - currentTimeMs) / 1000);
  };

  const getPlatformContestUrl = (contest: Contest) => {
    if (contest.platform === 'codeforces') {
      return `https://codeforces.com/contest/${(contest as CodeforcesContest).id}`;
    } else if (contest.platform === 'codechef') {
      return `https://www.codechef.com/${(contest as CodechefContest).contest_code}`;
    } else { // leetcode
      return `https://leetcode.com/contest/${(contest as LeetcodeContest).titleSlug}`;
    }
  };

  const toggleNotification = async (contest: Contest) => {
    let contestId = "";
    let contestName = "";
    let startTimeMs = 0;
    
    // Get contest ID and start time based on platform
    if (contest.platform === 'codeforces') {
      const cfContest = contest as CodeforcesContest;
      contestId = `cf-${cfContest.id}`;
      contestName = cfContest.name;
      startTimeMs = cfContest.startTimeSeconds * 1000;
    } else if (contest.platform === 'codechef') {
      const ccContest = contest as CodechefContest;
      contestId = `cc-${ccContest.contest_code}`;
      contestName = ccContest.contest_name;
      startTimeMs = new Date(ccContest.contest_start_date_iso).getTime();
    } else { // leetcode
      const lcContest = contest as LeetcodeContest;
      contestId = `lc-${lcContest.titleSlug}`;
      contestName = lcContest.title;
      startTimeMs = lcContest.startTime * 1000;
    }
    
    // Check if notification is already scheduled
    if (notifiedContests.includes(contestId)) {
      // Cancel notification
      await Notifications.cancelScheduledNotificationAsync(contestId);
      
      // Update state and storage
      const updatedNotifiedContests = notifiedContests.filter(id => id !== contestId);
      setNotifiedContests(updatedNotifiedContests);
      await AsyncStorage.setItem('notifiedContests', JSON.stringify(updatedNotifiedContests));
    } else {
      // Get seconds until 5 minutes before the contest
      const secondsUntilNotification = getSecondsUntilNotification(contest);
      
      if (secondsUntilNotification <= 0) {
        Alert.alert(
          "Cannot Set Notification",
          "This contest is starting in less than 5 minutes. No notification will be set."
        );
        return;
      }
      
      try {
        // Schedule notification for 5 minutes before contest starts
        await Notifications.scheduleNotificationAsync({
          identifier: contestId,
          content: {
            title: '🚀 Contest Starting Soon!',
            body: `${contestName} on ${contest.platform} starts in 5 minutes!`,
            data: { 
              contestId, 
              platform: contest.platform,
              url: getPlatformContestUrl(contest)
            },
          },
          trigger: { seconds: secondsUntilNotification },
        });
        
        // Update state and storage
        const updatedNotifiedContests = [...notifiedContests, contestId];
        setNotifiedContests(updatedNotifiedContests);
        await AsyncStorage.setItem('notifiedContests', JSON.stringify(updatedNotifiedContests));
        
        // Show confirmation to user
        Alert.alert(
          "Notification Set",
          `You will be notified 5 minutes before ${contestName} starts.`
        );
      } catch (error) {
        console.error('Error scheduling notification:', error);
        Alert.alert('Failed to schedule notification', 'Please try again later.');
      }
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

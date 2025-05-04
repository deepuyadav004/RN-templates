import { View, Text, StyleSheet, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Contest interfaces
interface CodeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds: number;
  platform: 'codeforces';
}

interface CodechefContest {
  contest_code: string;
  contest_name: string;
  contest_start_date_iso: string;
  contest_end_date_iso: string;
  contest_duration: string;
  platform: 'codechef';
}

// Combined contest type for our display
type Contest = CodeforcesContest | CodechefContest;

const ContestsScreen = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCodeforces = async (): Promise<CodeforcesContest[]> => {
    try {
      const response = await fetch('https://codeforces.com/api/contest.list');
      const data = await response.json();
      
      if (data.status === 'OK') {
        // Filter contests with phase "BEFORE" and add platform identifier
        return data.result
          .filter((contest: any) => contest.phase === 'BEFORE')
          .map((contest: any) => ({
            ...contest,
            platform: 'codeforces'
          }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching Codeforces contests:', err);
      return [];
    }
  };

  const fetchCodechef = async (): Promise<CodechefContest[]> => {
    try {
      const response = await fetch('https://www.codechef.com/api/list/contests/all');
      const data = await response.json();
      
      if (data.status === 'success') {
        // Map future contests and add platform identifier
        return data.future_contests.map((contest: any) => ({
          ...contest,
          platform: 'codechef'
        }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching CodeChef contests:', err);
      return [];
    }
  };

  const fetchAllContests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch contests from both platforms in parallel
      const [codeforcesContests, codechefContests] = await Promise.all([
        fetchCodeforces(),
        fetchCodechef()
      ]);
      
      // Combine and sort all contests by start time
      const allContests = [...codeforcesContests, ...codechefContests].sort((a, b) => {
        const timeA = a.platform === 'codeforces' ? a.startTimeSeconds : new Date(a.contest_start_date_iso).getTime() / 1000;
        const timeB = b.platform === 'codeforces' ? b.startTimeSeconds : new Date(b.contest_start_date_iso).getTime() / 1000;
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

  // Convert seconds to days, hours, minutes format
  const formatTimeRemaining = (startTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = startTime - now;
    
    if (remainingSeconds <= 0) return 'Starting soon';
    
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Format duration from seconds or minutes to hours and minutes
  const formatDuration = (duration: number | string, isMinutes = false) => {
    let durationSecs = typeof duration === 'string' ? parseInt(duration) : duration;
    if (isMinutes) durationSecs *= 60;
    
    const hours = Math.floor(durationSecs / 3600);
    const minutes = Math.floor((durationSecs % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  // Convert timestamp to readable date and time
  const formatStartTime = (timestamp: number | string) => {
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp * 1000) 
      : new Date(timestamp);
      
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformColors = (platform: string) => {
    return platform === 'codeforces' 
      ? { badge: '#5D3FD3', countdown: 'rgba(93, 63, 211, 0.9)' }
      : { badge: '#EC5B45', countdown: 'rgba(236, 91, 69, 0.9)' };
  };

  const renderContestItem = ({ item }: { item: Contest }) => {
    const isCodeforces = item.platform === 'codeforces';
    const colors = getPlatformColors(item.platform);
    
    // Get contest details based on platform
    const contestName = isCodeforces 
      ? (item as CodeforcesContest).name 
      : (item as CodechefContest).contest_name;
      
    const contestType = isCodeforces 
      ? (item as CodeforcesContest).type 
      : 'CodeChef';
      
    const startTime = isCodeforces 
      ? (item as CodeforcesContest).startTimeSeconds 
      : new Date((item as CodechefContest).contest_start_date_iso).getTime() / 1000;
      
    const duration = isCodeforces 
      ? (item as CodeforcesContest).durationSeconds 
      : (item as CodechefContest).contest_duration;
    
    return (
      <TouchableOpacity style={styles.contestCard}>
        <View style={[styles.contestBadge, { backgroundColor: colors.badge }]}>
          <Text style={styles.contestType}>{contestType}</Text>
        </View>
        
        <Text style={styles.contestName}>{contestName}</Text>
        
        <View style={styles.timeInfoContainer}>
          <View style={styles.timeInfoItem}>
            <Ionicons name="calendar-outline" size={18} color={colors.badge} />
            <Text style={styles.timeInfoText}>
              {isCodeforces 
                ? formatStartTime((item as CodeforcesContest).startTimeSeconds) 
                : formatStartTime((item as CodechefContest).contest_start_date_iso)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.timeInfoItem}>
            <Ionicons name="time-outline" size={18} color={colors.badge} />
            <Text style={styles.timeInfoText}>
              {isCodeforces 
                ? formatDuration((item as CodeforcesContest).durationSeconds) 
                : formatDuration((item as CodechefContest).contest_duration, true)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.countdownContainer, { backgroundColor: colors.countdown }]}>
          <Ionicons name="hourglass-outline" size={20} color="#fff" />
          <Text style={styles.countdownText}>
            Starts in: {formatTimeRemaining(startTime)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Upcoming Contests</Text>
          
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D3FD3" />
              <Text style={styles.loadingText}>Loading contests...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={40} color="#ff6b6b" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchAllContests}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : contests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={40} color="#5D3FD3" />
              <Text style={styles.emptyText}>No upcoming contests found</Text>
            </View>
          ) : (
            <FlatList
              data={contests}
              renderItem={renderContestItem}
              keyExtractor={(item) => 
                item.platform === 'codeforces' 
                  ? `cf-${(item as CodeforcesContest).id}` 
                  : `cc-${(item as CodechefContest).contest_code}`
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#5D3FD3"]} />
              }
            />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default ContestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Gudea-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#5D3FD3',
    fontSize: 16,
    fontFamily: 'Gudea-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Gudea-Regular',
  },
  retryButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Gudea-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Gudea-Regular',
  },
  listContainer: {
    paddingBottom: 100, // Add padding to account for bottom navigation
  },
  contestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(236, 236, 246, 0.9)',
  },
  contestBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#5D3FD3',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  contestType: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Gudea-Bold',
  },
  contestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
    fontFamily: 'Gudea-Bold',
    lineHeight: 24,
  },
  timeInfoContainer: {
    backgroundColor: 'rgba(245, 245, 255, 0.9)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 250, 0.9)',
  },
  timeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  timeInfoText: {
    marginLeft: 8,
    color: '#444',
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(93, 63, 211, 0.2)',
    marginHorizontal: 10,
  },
  countdownContainer: {
    backgroundColor: 'rgba(93, 63, 211, 0.9)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Gudea-Bold',
  },
});

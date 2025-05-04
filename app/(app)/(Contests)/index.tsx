import { View, Text, StyleSheet, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Contest interface based on Codeforces API
interface Contest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
}

const ContestsScreen = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://codeforces.com/api/contest.list');
      const data = await response.json();
      
      if (data.status === 'OK') {
        // Filter contests with phase "BEFORE" and sort by start time
        const upcomingContests = data.result
          .filter((contest: Contest) => contest.phase === 'BEFORE')
          .sort((a: Contest, b: Contest) => a.startTimeSeconds - b.startTimeSeconds);
        
        setContests(upcomingContests);
      } else {
        setError('Failed to fetch contests');
      }
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError('Failed to connect to Codeforces API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchContests();
  };

  // Convert seconds to days, hours, minutes format
  const formatTimeRemaining = (startTimeSeconds: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = startTimeSeconds - now;
    
    if (remainingSeconds <= 0) return 'Starting soon';
    
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Format duration from seconds to hours and minutes
  const formatDuration = (durationSeconds: number) => {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  // Convert timestamp to readable date and time
  const formatStartTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContestItem = ({ item }: { item: Contest }) => (
    <TouchableOpacity style={styles.contestCard}>
      <View style={styles.contestBadge}>
        <Text style={styles.contestType}>{item.type}</Text>
      </View>
      
      <Text style={styles.contestName}>{item.name}</Text>
      
      <View style={styles.timeInfoContainer}>
        <View style={styles.timeInfoItem}>
          <Ionicons name="calendar-outline" size={18} color="#5D3FD3" />
          <Text style={styles.timeInfoText}>{formatStartTime(item.startTimeSeconds)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.timeInfoItem}>
          <Ionicons name="time-outline" size={18} color="#5D3FD3" />
          <Text style={styles.timeInfoText}>{formatDuration(item.durationSeconds)}</Text>
        </View>
      </View>
      
      <View style={styles.countdownContainer}>
        <Ionicons name="hourglass-outline" size={20} color="#fff" />
        <Text style={styles.countdownText}>
          Starts in: {formatTimeRemaining(item.startTimeSeconds)}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
              <TouchableOpacity style={styles.retryButton} onPress={fetchContests}>
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
              keyExtractor={(item) => item.id.toString()}
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

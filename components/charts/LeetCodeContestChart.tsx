import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';

interface LeetCodeContestChartProps {
  username: string;
}

interface ContestParticipation {
  attended: boolean;
  rating: number;
  ranking: number;
  trendDirection: string;
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number;
  contest: {
    title: string;
    startTime: number;
  };
}

interface LeetCodeContestData {
  contestAttend: number;
  contestRating: number;
  contestGlobalRanking: number;
  totalParticipants: number;
  contestTopPercentage: number;
  contestBadges: {
    name: string;
  };
  contestParticipation: ContestParticipation[];
}

const LeetCodeContestChart: React.FC<LeetCodeContestChartProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contestData, setContestData] = useState<LeetCodeContestData | null>(null);

  useEffect(() => {
    const fetchLeetCodeContestData = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.contestAttend) {
          setContestData(data);
        } else {
          setError('Failed to fetch LeetCode contest data');
        }
      } catch (err) {
        console.error('Error fetching LeetCode contest data:', err);
        setError('Failed to load LeetCode contest statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeContestData();
  }, [username]);

  const chartData = useMemo(() => {
    if (!contestData || !contestData.contestParticipation || contestData.contestParticipation.length === 0) {
      return null;
    }
    
    // Sort contest participation by date (startTime)
    const sortedParticipation = [...contestData.contestParticipation]
      .sort((a, b) => a.contest.startTime - b.contest.startTime);
    
    // Get the last 15 contests for better visibility if there are many
    const recentContests = sortedParticipation.slice(-15);
    
    return {
      labels: recentContests.map((_, index) => `${index + 1}`),
      datasets: [
        {
          data: recentContests.map(contest => contest.rating),
          color: (opacity = 1) => `rgba(255, 161, 22, ${opacity})`, // LeetCode orange
          strokeWidth: 2,
        }
      ],
      legend: ["Contest Rating"]
    };
  }, [contestData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading LeetCode contest data...</Text>
      </View>
    );
  }

  if (error || !contestData || !chartData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No contest data available'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Contest Performance</Text>
      </View>
      
      <View style={styles.statsOverview}>
        <Text style={styles.statHeading}>
          Current Rating: <Text style={styles.statValue}>{Math.round(contestData.contestRating)}</Text>
        </Text>
        <Text style={styles.badgeText}>
          Badge: <Text style={styles.badgeValue}>{contestData.contestBadges.name}</Text>
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 161, 22, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#FFA116',
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
            },
          }}
          bezier
          style={styles.chart}
          fromZero={false}
        />
        <Text style={styles.chartLabel}>Last {chartData.labels.length} Contests</Text>
      </View>
      
      <View style={styles.additionalStatsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Contests Attended</Text>
          <Text style={styles.statData}>{contestData.contestAttend}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Global Rank</Text>
          <Text style={styles.statData}>{contestData.contestGlobalRanking.toLocaleString()}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Top Percentage</Text>
          <Text style={styles.statData}>{contestData.contestTopPercentage}%</Text>
        </View>
      </View>
      
      <View style={styles.recentContestContainer}>
        <Text style={styles.recentContestTitle}>Recent Contest Performance</Text>
        {contestData.contestParticipation.slice(-3).reverse().map((contest, index) => (
          <View key={index} style={styles.contestItem}>
            <View style={styles.contestHeader}>
              <Text style={styles.contestTitle}>{contest.contest.title}</Text>
              <Text 
                style={[
                  styles.trendIndicator, 
                  { color: contest.trendDirection === 'UP' ? '#4CAF50' : '#F44336' }
                ]}
              >
                {contest.trendDirection === 'UP' ? '↑' : '↓'}
              </Text>
            </View>
            <View style={styles.contestDetails}>
              <View style={styles.contestDetailItem}>
                <Text style={styles.detailLabel}>Rating</Text>
                <Text style={styles.detailValue}>{Math.round(contest.rating)}</Text>
              </View>
              <View style={styles.contestDetailItem}>
                <Text style={styles.detailLabel}>Rank</Text>
                <Text style={styles.detailValue}>{contest.ranking.toLocaleString()}</Text>
              </View>
              <View style={styles.contestDetailItem}>
                <Text style={styles.detailLabel}>Solved</Text>
                <Text style={styles.detailValue}>{contest.problemsSolved}/{contest.totalProblems}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 200, 200, 0.8)',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(255, 161, 22, 0.1)',
    borderRadius: 10,
  },
  statHeading: {
    fontSize: 15,
    fontFamily: 'Gudea-Regular',
    color: '#555',
  },
  statValue: {
    fontFamily: 'Gudea-Bold',
    color: '#FFA116',
  },
  badgeText: {
    fontSize: 15,
    fontFamily: 'Gudea-Regular',
    color: '#555',
  },
  badgeValue: {
    fontFamily: 'Gudea-Bold',
    color: '#FFA116',
  },
  chartContainer: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'Gudea-Regular',
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  additionalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 10,
    padding: 12,
    width: '31%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Gudea-Regular',
    color: '#777',
    marginBottom: 5,
    textAlign: 'center',
  },
  statData: {
    fontSize: 15,
    fontFamily: 'Gudea-Bold',
    color: '#333',
  },
  recentContestContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recentContestTitle: {
    fontSize: 15,
    fontFamily: 'Gudea-Bold',
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  contestItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  contestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  contestTitle: {
    fontSize: 14,
    fontFamily: 'Gudea-Bold',
    color: '#444',
  },
  trendIndicator: {
    fontSize: 18,
    fontFamily: 'Gudea-Bold',
  },
  contestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contestDetailItem: {
    alignItems: 'center',
    width: '33%',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Gudea-Regular',
    color: '#777',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Gudea-Bold',
    color: '#333',
  },
});

export default LeetCodeContestChart;

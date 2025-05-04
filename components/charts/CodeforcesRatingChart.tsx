import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';

interface RatingData {
  contestName: string;
  newRating: number;
  oldRating: number;
  ratingUpdateTimeSeconds: number;
}

interface CodeforcesRatingChartProps {
  username: string;
}

const CodeforcesRatingChart: React.FC<CodeforcesRatingChartProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingHistory, setRatingHistory] = useState<RatingData[]>([]);
  
  useEffect(() => {
    const fetchRatingData = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.result && data.result.length > 0) {
          setRatingHistory(data.result);
          setError(null);
        } else {
          setError('No rating data available');
        }
      } catch (err) {
        setError('Failed to fetch rating data');
        console.error('Error fetching Codeforces rating data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRatingData();
  }, [username]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading rating history...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  if (ratingHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No contest history found</Text>
      </View>
    );
  }
  
  // Prepare data for the chart
  const ratings = ratingHistory.map(item => item.newRating);
  const labels = ratingHistory.map((_, index) => {
    // Show contest number like 1, 5, 10, 15, etc.
    return (index + 1) % 5 === 0 || index === 0 || index === ratingHistory.length - 1 
      ? `${index + 1}` 
      : '';
  });
  
  const chartData = {
    labels,
    datasets: [
      {
        data: ratings,
        color: (opacity = 1) => `rgba(255, 127, 80, ${opacity})`, // Coral color
        strokeWidth: 2,
      },
    ],
    legend: [`${username}'s Rating`],
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>Rating History</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backgroundGradientFrom: 'rgba(255, 255, 255, 0.9)',
            backgroundGradientTo: 'rgba(255, 255, 255, 0.9)',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 106, 78, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: Colors.CORAL,
            },
            propsForBackgroundLines: {
              stroke: 'rgba(0, 0, 0, 0.05)',
              strokeDasharray: '5, 5',
            },
            propsForLabels: {
              fontFamily: 'Gudea-Regular',
              fontSize: 10,
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withDots={true}
          withShadow={true}
          segments={5}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current Rating</Text>
          <Text style={styles.statValue}>{ratingHistory[ratingHistory.length-1]?.newRating || 'N/A'}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Highest Rating</Text>
          <Text style={styles.statValue}>{Math.max(...ratings)}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.contestsInfo}>
          Total Contests: <Text style={styles.contestsCount}>{ratingHistory.length}</Text>
        </Text>
        <Text style={styles.ratingDifference}>
          {ratingHistory.length > 1 ? (
            <>
              Overall Change: 
              <Text style={[
                styles.diffValue, 
                ratingHistory[ratingHistory.length-1].newRating - ratingHistory[0].newRating > 0 
                  ? styles.positive 
                  : styles.negative
              ]}>
                {' '}{ratingHistory[ratingHistory.length-1].newRating - ratingHistory[0].newRating > 0 ? '+' : ''}
                {ratingHistory[ratingHistory.length-1].newRating - ratingHistory[0].newRating}
              </Text>
            </>
          ) : ''}
        </Text>
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Gudea-Italic',
  },
  chartTitleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
    paddingRight: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 12,
    minWidth: '40%',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 5,
  },
  contestsInfo: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
  },
  contestsCount: {
    fontFamily: 'Gudea-Bold',
    color: '#555',
  },
  ratingDifference: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
  },
  diffValue: {
    fontFamily: 'Gudea-Bold',
    fontSize: 14,
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
});

export default CodeforcesRatingChart;

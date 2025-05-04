import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.5);
      setIsZoomed(true);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      const newZoomLevel = Math.max(1, zoomLevel - 0.5);
      setZoomLevel(newZoomLevel);
      setIsZoomed(newZoomLevel > 1);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };

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

  const ratings = ratingHistory.map(item => item.newRating);
  const labels = ratingHistory.map((_, index) => {
    const interval = ratingHistory.length > 20 ? 
      (isZoomed ? 5 : 10) : 5;
    return (index + 1) % interval === 0 || index === 0 || index === ratingHistory.length - 1 
      ? `${index + 1}` 
      : '';
  });

  const baseWidth = Dimensions.get('window').width - 60;
  const zoomedWidth = baseWidth * zoomLevel;
  const chartWidth = Math.max(zoomedWidth, ratingHistory.length * 15);

  const chartData = {
    labels,
    datasets: [
      {
        data: ratings,
        color: (opacity = 1) => `rgba(255, 127, 80, ${opacity})`,
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
      
      <View style={styles.zoomControlsContainer}>
        <TouchableOpacity 
          style={styles.zoomButton} 
          onPress={handleZoomOut}
          disabled={zoomLevel <= 1}
        >
          <Feather 
            name="zoom-out" 
            size={18} 
            color={zoomLevel <= 1 ? '#ccc' : Colors.DARK_GREEN} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.zoomButton} 
          onPress={handleResetZoom}
          disabled={!isZoomed}
        >
          <Feather 
            name="maximize" 
            size={18} 
            color={!isZoomed ? '#ccc' : Colors.DARK_GREEN} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.zoomButton} 
          onPress={handleZoomIn}
          disabled={zoomLevel >= 3}
        >
          <Feather 
            name="zoom-in" 
            size={18} 
            color={zoomLevel >= 3 ? '#ccc' : Colors.DARK_GREEN} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartWithYAxis}>
        <View style={styles.yAxisLabelContainer}>
          <Text style={styles.yAxisLabel}>Rating</Text>
        </View>
        
        <View style={styles.chartContainer}>
          {isZoomed ? (
            <ScrollView 
              horizontal 
              ref={scrollViewRef}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.scrollContent}
              bounces={false}
            >
              <LineChart
                data={chartData}
                width={chartWidth}
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
                    r: '4',
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
                  formatYLabel: (value) => `${value}`,
                }}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={false}
                withDots={true}
                withShadow={true}
                segments={5}
                fromZero={false}
                yAxisLabel=""
                yAxisSuffix=""
              />
            </ScrollView>
          ) : (
            <LineChart
              data={chartData}
              width={baseWidth}
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
                  r: '3',
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
                formatYLabel: (value) => `${value}`,
              }}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withDots={true}
              withShadow={true}
              segments={5}
              fromZero={false}
              yAxisLabel=""
              yAxisSuffix=""
            />
          )}
        </View>
      </View>
      
      <View style={styles.xAxisLabelContainer}>
        <Text style={styles.xAxisLabel}>Contest Number</Text>
        {isZoomed && (
          <Text style={styles.zoomInstructions}>Scroll horizontally to view all data</Text>
        )}
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
  chartWithYAxis: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  yAxisLabelContainer: {
    width: 20,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yAxisLabel: {
    transform: [{ rotate: '-90deg' }],
    fontSize: 12,
    fontFamily: 'Gudea-Bold',
    color: '#555',
    width: 220,
    textAlign: 'center',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  xAxisLabelContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  xAxisLabel: {
    fontSize: 12,
    fontFamily: 'Gudea-Bold',
    color: '#555',
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
  zoomControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  zoomButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    marginHorizontal: 10,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  scrollContent: {
    paddingRight: 20,
  },
  zoomInstructions: {
    fontSize: 10,
    fontFamily: 'Gudea-Italic',
    color: '#777',
    marginTop: 4,
  },
});

export default CodeforcesRatingChart;

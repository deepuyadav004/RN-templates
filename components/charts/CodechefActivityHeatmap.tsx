import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';
import { LineChart } from 'react-native-chart-kit';

interface CodechefActivityHeatmapProps {
  username: string;
}

interface ContributionDay {
  date: string;
  value: number;
}

interface RatingDataPoint {
  code: string;
  rating: string;
  rank: string;
  name: string;
  end_date: string;
  color: string;
  getyear: string;
  getmonth: string;
  getday: string;
}

interface CodechefUserData {
  success: boolean;
  status: number;
  profile?: string;
  name?: string;
  currentRating?: number;
  highestRating?: number;
  countryFlag?: string;
  countryName?: string;
  globalRank?: number;
  countryRank?: number;
  stars?: string;
  heatMap?: ContributionDay[];
  ratingData?: RatingDataPoint[];
}

const CodechefActivityHeatmap: React.FC<CodechefActivityHeatmapProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<CodechefUserData | null>(null);

  useEffect(() => {
    const fetchCodechefActivity = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
        const data = await response.json();
        
        if (data && data.success) {
          setUserData(data);
        } else {
          setError('No data available for this user');
        }
      } catch (err) {
        setError('Failed to fetch CodeChef data');
        console.error('Error fetching CodeChef activity:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCodechefActivity();
  }, [username]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading CodeChef activity...</Text>
      </View>
    );
  }
  
  if (error || !userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Failed to load data'}</Text>
      </View>
    );
  }
  
  const { heatMap, ratingData, currentRating, highestRating, globalRank, countryRank, stars } = userData;
  
  if (!heatMap || heatMap.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No activity data found</Text>
      </View>
    );
  }

  // Format heatmap data for the component
  const contributionData = heatMap.map(item => ({
    date: item.date,
    count: item.value
  }));

  // Calculate chart width for scrollable view
  const chartWidth = Math.max(Dimensions.get('window').width - 40, 1000);

  // Prepare rating chart data if available
  const hasRatingData = ratingData && ratingData.length > 0;
  const ratingChartData = hasRatingData ? {
    labels: ratingData.slice(-8).map((item, index) => `${index + 1}`),
    datasets: [
      {
        data: ratingData.slice(-8).map(item => parseInt(item.rating)),
        color: (opacity = 1) => `rgba(104, 66, 115, ${opacity})`, // CodeChef color
        strokeWidth: 2,
      },
    ],
    legend: ["Rating History"]
  } : null;

  return (
    <View style={styles.container}>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>CodeChef Activity</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current Rating</Text>
          <Text style={styles.statValue}>{currentRating || 'N/A'}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Highest Rating</Text>
          <Text style={styles.statValue}>{highestRating || 'N/A'}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Stars</Text>
          <Text style={styles.statValue}>{stars || 'N/A'}</Text>
        </View>
      </View>
      
      <View style={styles.rankContainer}>
        <View style={styles.rankItem}>
          <Text style={styles.rankLabel}>Global Rank</Text>
          <Text style={styles.rankValue}>{globalRank || 'N/A'}</Text>
        </View>
        
        <View style={styles.rankItem}>
          <Text style={styles.rankLabel}>Country Rank</Text>
          <Text style={styles.rankValue}>{countryRank || 'N/A'}</Text>
        </View>
      </View>
      
      {hasRatingData && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartSubtitle}>Rating History</Text>
          <LineChart
            data={ratingChartData}
            width={Dimensions.get('window').width - 40}
            height={180}
            chartConfig={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backgroundGradientFrom: 'rgba(255, 255, 255, 0.9)',
              backgroundGradientTo: 'rgba(255, 255, 255, 0.9)',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(104, 66, 115, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#684273',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartSubtitle}>Submission Activity</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <ContributionGraph
            values={contributionData}
            endDate={new Date()}
            numDays={365}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backgroundGradientFrom: 'rgba(255, 255, 255, 0.9)',
              backgroundGradientTo: 'rgba(255, 255, 255, 0.9)',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(104, 66, 115, ${opacity})`, // CodeChef purple color
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={styles.heatmap}
            tooltipDataAttrs={(value: { date: string; count: number }) => ({
              'data-tip': `${value.date}: ${value.count} submissions`,
            })}
            showOutOfRangeDays={false}
          />
        </ScrollView>
        <Text style={styles.scrollHint}>
          Scroll horizontally to view full activity history
        </Text>
      </View>
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Activity Levels</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItemContainer}>
            <View style={[styles.legendColorBox, { backgroundColor: 'rgba(104, 66, 115, 0.1)' }]} />
            <Text style={styles.legendText}>0-2 submissions</Text>
          </View>
          <View style={styles.legendItemContainer}>
            <View style={[styles.legendColorBox, { backgroundColor: 'rgba(104, 66, 115, 0.4)' }]} />
            <Text style={styles.legendText}>3-10 submissions</Text>
          </View>
          <View style={styles.legendItemContainer}>
            <View style={[styles.legendColorBox, { backgroundColor: 'rgba(104, 66, 115, 0.7)' }]} />
            <Text style={styles.legendText}>11-25 submissions</Text>
          </View>
          <View style={styles.legendItemContainer}>
            <View style={[styles.legendColorBox, { backgroundColor: 'rgba(104, 66, 115, 1.0)' }]} />
            <Text style={styles.legendText}>25+ submissions</Text>
          </View>
        </View>
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
    marginBottom: 15,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 10,
    padding: 10,
    minWidth: '30%',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Gudea-Bold',
    color: '#684273', // CodeChef purple
  },
  rankContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  rankItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(104, 66, 115, 0.1)',
    borderRadius: 10,
    padding: 10,
    minWidth: '45%',
  },
  rankLabel: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    marginBottom: 5,
  },
  rankValue: {
    fontSize: 18,
    fontFamily: 'Gudea-Bold',
    color: '#684273', // CodeChef purple
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chartSubtitle: {
    fontSize: 15,
    fontFamily: 'Gudea-Bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  heatmap: {
    marginVertical: 8,
    borderRadius: 16,
  },
  scrollHint: {
    fontSize: 12,
    fontFamily: 'Gudea-Italic',
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
  },
  legendContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  legendTitle: {
    fontSize: 15,
    fontFamily: 'Gudea-Bold',
    color: '#684273',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(104, 66, 115, 0.1)',
    paddingVertical: 5,
    borderRadius: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginVertical: 5,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Gudea-Regular',
    color: '#555',
  },
});

export default CodechefActivityHeatmap;

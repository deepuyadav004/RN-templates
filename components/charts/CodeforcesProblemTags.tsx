import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';

interface ProblemSubmission {
  id: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    tags: string[];
  };
  verdict: string;
}

interface CodeforcesProblemTagsProps {
  username: string;
}

const CodeforcesProblemTags: React.FC<CodeforcesProblemTagsProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagStats, setTagStats] = useState<Record<string, number>>({});
  const [totalSolved, setTotalSolved] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.result && data.result.length > 0) {
          processSubmissions(data.result);
        } else {
          setError('No submission data available');
        }
      } catch (err) {
        setError('Failed to fetch submission data');
        console.error('Error fetching Codeforces submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [username]);
  
  const processSubmissions = (submissions: ProblemSubmission[]) => {
    const solvedProblems = new Map();
    const tagCount: Record<string, number> = {};
    
    submissions.forEach(submission => {
      if (submission.verdict === 'OK') {
        const problemKey = `${submission.problem.contestId}${submission.problem.index}`;
        if (!solvedProblems.has(problemKey)) {
          solvedProblems.set(problemKey, true);
          
          if (submission.problem.tags) {
            submission.problem.tags.forEach(tag => {
              tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
          }
        }
      }
    });
    
    setTagStats(tagCount);
    setTotalSolved(solvedProblems.size);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading problem statistics...</Text>
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
  
  const tagEntries = Object.entries(tagStats);
  
  if (tagEntries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No solved problems found</Text>
      </View>
    );
  }
  
  tagEntries.sort((a, b) => b[1] - a[1]);
  
  const topTags = tagEntries.slice(0, 10);
  
  const labels = topTags.map(() => '');
  
  const colors = [
    '#FF6384', // Pink
    '#FF9F40', // Orange
    '#FFCD56', // Yellow
    '#4BC0C0', // Teal
    '#36A2EB', // Blue
    '#9966FF', // Purple
    '#FF6384', // Pink
    '#FF9F40', // Orange
    '#FFCD56', // Yellow
    '#4BC0C0', // Teal
  ];
  
  const data = {
    labels,
    datasets: [
      {
        data: topTags.map(([_, count]) => Math.round((count / totalSolved) * 100)),
        colors: topTags.map((_, i) => (opacity = 1) => colors[i % colors.length]),
      },
    ],
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>Problem Categories</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.totalSolvedText}>
          Total Problems Solved: <Text style={styles.totalSolvedValue}>{totalSolved}</Text>
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <BarChart
          data={data}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backgroundGradientFrom: 'rgba(255, 255, 255, 0.9)',
            backgroundGradientTo: 'rgba(255, 255, 255, 0.9)',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.8,
            propsForLabels: {
              fontSize: 0,
              opacity: 0,
            },
            propsForBackgroundLines: {
              stroke: 'rgba(0, 0, 0, 0.05)',
              strokeDasharray: '5, 5',
            },
          }}
          style={styles.chart}
          showValuesOnTopOfBars={true}
          fromZero
          withHorizontalLabels={true}
          segments={5}
          flatColor={true}
        />
      </View>
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Top Problem Categories</Text>
        <View style={styles.legendGrid}>
          {topTags.map(([tag, count], index) => (
            <View key={tag} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColorBox, 
                  { backgroundColor: colors[index % colors.length] }
                ]} 
              />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendTag}>{tag}</Text>
                <Text style={styles.legendCount}>{count} ({Math.round((count / totalSolved) * 100)}%)</Text>
              </View>
            </View>
          ))}
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
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 10,
    borderRadius: 10,
  },
  totalSolvedText: {
    fontSize: 15,
    fontFamily: 'Gudea-Regular',
    color: '#555',
  },
  totalSolvedValue: {
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
    fontSize: 17,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
    paddingRight: 0,
  },
  legendContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
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
    color: Colors.DARK_GREEN,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 5,
    borderRadius: 8,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    borderRadius: 6,
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 6,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendTag: {
    fontSize: 12,
    fontFamily: 'Gudea-Bold',
    color: '#444',
  },
  legendCount: {
    fontSize: 11,
    fontFamily: 'Gudea-Regular',
    color: '#666',
  },
});

export default CodeforcesProblemTags;
